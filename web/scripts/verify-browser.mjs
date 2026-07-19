import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const debugPort = Number(process.env.CHROME_DEBUG_PORT ?? "9237");
const appOrigin = process.env.APP_ORIGIN ?? "http://localhost:3000";
const rootDir = path.resolve(process.cwd(), "..");
const slideUrl = pathToFileURL(
  path.join(rootDir, "materials", "2026", "slides", "kcl-frontend-2026.html"),
).href;

const viewports = [
  { width: 1920, height: 1080, name: "desktop-hd" },
  { width: 1280, height: 720, name: "desktop" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 375, height: 667, name: "mobile" },
  { width: 667, height: 375, name: "mobile-landscape" },
];

class CdpClient {
  constructor(webSocket) {
    this.webSocket = webSocket;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();

    this.webSocket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));

      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);

        if (message.error) {
          reject(new Error(message.error.message));
          return;
        }

        resolve(message.result ?? {});
        return;
      }

      const listeners = this.listeners.get(message.method) ?? [];
      for (const listener of listeners) {
        listener(message);
      }
    });
  }

  static connect(webSocketUrl) {
    return new Promise((resolve, reject) => {
      const webSocket = new WebSocket(webSocketUrl);

      webSocket.addEventListener("open", () => resolve(new CdpClient(webSocket)));
      webSocket.addEventListener("error", () => {
        reject(new Error(`Unable to connect to Chrome at ${webSocketUrl}`));
      });
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId;
    this.nextId += 1;

    const payload = sessionId
      ? { id, method, params, sessionId }
      : { id, method, params };

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.webSocket.send(JSON.stringify(payload));
    });
  }

  waitForEvent(method, predicate, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const listeners = this.listeners.get(method) ?? [];
      const timeout = setTimeout(() => {
        this.listeners.set(
          method,
          (this.listeners.get(method) ?? []).filter((listener) => listener !== onEvent),
        );
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);

      const onEvent = (message) => {
        if (!predicate(message)) {
          return;
        }

        clearTimeout(timeout);
        this.listeners.set(
          method,
          (this.listeners.get(method) ?? []).filter((listener) => listener !== onEvent),
        );
        resolve(message);
      };

      this.listeners.set(method, [...listeners, onEvent]);
    });
  }

  close() {
    this.webSocket.close();
  }
}

async function waitForChromeVersion() {
  const endpoint = `http://127.0.0.1:${debugPort}/json/version`;

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(endpoint);

      if (response.ok) {
        return response.json();
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error(`Chrome did not expose ${endpoint}`);
}

async function createPage(client) {
  const { targetId } = await client.send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await client.send("Target.attachToTarget", {
    flatten: true,
    targetId,
  });

  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);
  await client.send("Input.setIgnoreInputEvents", { ignore: false }, sessionId);

  return { sessionId, targetId };
}

async function setViewport(client, sessionId, viewport) {
  await client.send(
    "Emulation.setDeviceMetricsOverride",
    {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 500,
    },
    sessionId,
  );
}

async function navigate(client, sessionId, url) {
  const load = client.waitForEvent(
    "Page.loadEventFired",
    (message) => message.sessionId === sessionId,
  );

  await client.send("Page.navigate", { url }, sessionId);
  await load;
}

async function evaluate(client, sessionId, expression) {
  const result = await client.send(
    "Runtime.evaluate",
    {
      awaitPromise: true,
      expression,
      returnByValue: true,
    },
    sessionId,
  );

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? "Runtime evaluation failed");
  }

  return result.result.value;
}

async function pressKey(client, sessionId, key, code, keyCode) {
  await client.send(
    "Input.dispatchKeyEvent",
    { code, key, type: "keyDown", windowsVirtualKeyCode: keyCode },
    sessionId,
  );
  await client.send(
    "Input.dispatchKeyEvent",
    { code, key, type: "keyUp", windowsVirtualKeyCode: keyCode },
    sessionId,
  );
}

async function verifySlides(client, sessionId) {
  const failures = [];

  for (const viewport of viewports) {
    await setViewport(client, sessionId, viewport);
    await navigate(client, sessionId, slideUrl);
    await new Promise((resolve) => setTimeout(resolve, 250));

    const result = await evaluate(
      client,
      sessionId,
      `(() => {
        document.querySelectorAll(".slide").forEach((slide) => slide.classList.add("is-active"));
        const slideData = [...document.querySelectorAll(".slide")].map((slide, index) => ({
          index: index + 1,
          scrollWidth: slide.scrollWidth,
          clientWidth: slide.clientWidth,
          scrollHeight: slide.scrollHeight,
          clientHeight: slide.clientHeight
        }));
        const badContents = [...document.querySelectorAll(".slide-content")].map((content, index) => {
          const contentRect = content.getBoundingClientRect();
          const badChildren = [...content.children]
            .filter((child) => getComputedStyle(child).display !== "none")
            .map((child) => {
              const rect = child.getBoundingClientRect();
              return {
                tag: child.tagName.toLowerCase(),
                top: Math.round(rect.top),
                right: Math.round(rect.right),
                bottom: Math.round(rect.bottom),
                left: Math.round(rect.left)
              };
            })
            .filter((rect) =>
              rect.left < contentRect.left - 2 ||
              rect.right > contentRect.right + 2 ||
              rect.top < contentRect.top - 2 ||
              rect.bottom > contentRect.bottom + 2
            );

          return badChildren.length > 0 ? { index: index + 1, badChildren } : null;
        }).filter(Boolean);
        return {
          title: document.title,
          slideCount: slideData.length,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
          badSlides: slideData.filter((item) => item.scrollWidth > item.clientWidth + 2 || item.scrollHeight > item.clientHeight + 2),
          badContents
        };
      })()`,
    );

    if (result.slideCount !== 26) {
      failures.push(`${viewport.name}: expected 26 slides, found ${result.slideCount}`);
    }

    if (result.horizontalOverflow) {
      failures.push(`${viewport.name}: document has horizontal overflow`);
    }

    if (result.badSlides.length > 0 || result.badContents.length > 0) {
      failures.push(
        `${viewport.name}: slide/content overflow ${JSON.stringify({
          slides: result.badSlides,
          contents: result.badContents,
        })}`,
      );
    }
  }

  await setViewport(client, sessionId, { width: 1280, height: 720 });
  await navigate(client, sessionId, slideUrl);
  await pressKey(client, sessionId, "ArrowRight", "ArrowRight", 39);
  await new Promise((resolve) => setTimeout(resolve, 650));

  const navigationResult = await evaluate(
    client,
    sessionId,
    `(() => ({
      title: document.title,
      scrollY: Math.round(window.scrollY),
      counter: document.querySelector(".slide-number")?.textContent
    }))()`,
  );

  if (!navigationResult.counter?.startsWith("2 /")) {
    failures.push(`keyboard navigation did not advance: ${JSON.stringify(navigationResult)}`);
  }

  if (failures.length > 0) {
    throw new Error(`Slide verification failed:\n${failures.join("\n")}`);
  }
}

async function verifyApp(client, sessionId) {
  await setViewport(client, sessionId, { width: 1280, height: 720 });
  await navigate(client, sessionId, appOrigin);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const home = await evaluate(
    client,
    sessionId,
    `(() => ({
      heading: document.querySelector("h1")?.textContent?.trim(),
      productCount: document.querySelectorAll(".product-card").length,
      hasSearch: Boolean(document.querySelector("#product-search"))
    }))()`,
  );

  if (!home.heading?.includes("ショッピングアプリ")) {
    throw new Error(`Unexpected home heading: ${JSON.stringify(home)}`);
  }

  if (home.productCount !== 8 || !home.hasSearch) {
    throw new Error(`Unexpected home state: ${JSON.stringify(home)}`);
  }

  const inputRect = await evaluate(
    client,
    sessionId,
    `(() => {
      const input = document.querySelector("#product-search");
      input.scrollIntoView({ block: "center" });
      const rect = input.getBoundingClientRect();
      return {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2)
      };
    })()`,
  );

  await client.send(
    "Input.dispatchMouseEvent",
    { button: "left", clickCount: 1, type: "mouseMoved", x: inputRect.x, y: inputRect.y },
    sessionId,
  );
  await client.send(
    "Input.dispatchMouseEvent",
    { button: "left", clickCount: 1, type: "mousePressed", x: inputRect.x, y: inputRect.y },
    sessionId,
  );
  await client.send(
    "Input.dispatchMouseEvent",
    { button: "left", clickCount: 1, type: "mouseReleased", x: inputRect.x, y: inputRect.y },
    sessionId,
  );
  await evaluate(
    client,
    sessionId,
    `(() => {
      const input = document.querySelector("#product-search");
      input.focus();
      document.execCommand("selectAll", false);
      document.execCommand("insertText", false, "next");
      return input.value;
    })()`,
  );
  await evaluate(
    client,
    sessionId,
    `(() => {
      const input = document.querySelector("#product-search");
      if (input._valueTracker) {
        input._valueTracker.setValue("");
      }
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return input.value;
    })()`,
  );
  await new Promise((resolve) => setTimeout(resolve, 400));

  const searchInput = await evaluate(
    client,
    sessionId,
    `(() => ({
      activeElementId: document.activeElement?.id,
      inputValue: document.querySelector("#product-search")?.value
    }))()`,
  );

  if (searchInput.activeElementId !== "product-search" || searchInput.inputValue !== "next") {
    throw new Error(`Search input did not accept text: ${JSON.stringify(searchInput)}`);
  }

  await navigate(client, sessionId, `${appOrigin}/products/gadget-speaker`);
  const detail = await evaluate(
    client,
    sessionId,
    `(() => ({
      heading: document.querySelector("h1")?.textContent?.trim(),
      hasBackLink: [...document.querySelectorAll("a")].some((link) => link.textContent?.includes("商品一覧に戻る"))
    }))()`,
  );

  if (detail.heading !== "ポケットスピーカー" || !detail.hasBackLink) {
    throw new Error(`Unexpected detail page: ${JSON.stringify(detail)}`);
  }

  await navigate(client, sessionId, `${appOrigin}/order`);
  const order = await evaluate(
    client,
    sessionId,
    `(() => ({
      heading: document.querySelector("h1")?.textContent?.trim(),
      inputCount: document.querySelectorAll("input, textarea, select").length,
      hasSubmit: [...document.querySelectorAll("button")].some((button) => button.textContent?.includes("入力内容"))
    }))()`,
  );

  if (order.heading !== "注文フォーム" || order.inputCount < 5 || !order.hasSubmit) {
    throw new Error(`Unexpected order page: ${JSON.stringify(order)}`);
  }
}

const profileDir = path.join(os.tmpdir(), `kcl-frontend-chrome-${Date.now()}`);
await mkdir(profileDir, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

let stderr = "";
chrome.stderr.on("data", (chunk) => {
  stderr += String(chunk);
});

try {
  const version = await waitForChromeVersion();
  const client = await CdpClient.connect(version.webSocketDebuggerUrl);
  const { sessionId, targetId } = await createPage(client);

  await verifySlides(client, sessionId);
  await verifyApp(client, sessionId);
  await client.send("Target.closeTarget", { targetId });
  client.close();

  console.log("Browser verification passed.");
} catch (error) {
  console.error(error);
  if (stderr.trim()) {
    console.error(stderr.trim().split("\n").slice(-8).join("\n"));
  }
  process.exitCode = 1;
} finally {
  if (chrome.exitCode === null) {
    chrome.kill("SIGTERM");
    await Promise.race([
      once(chrome, "exit"),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(profileDir, { force: true, recursive: true });
      break;
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
}
