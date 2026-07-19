import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = path.resolve(process.cwd(), "..");
const materialDir = path.join(rootDir, "materials", "2026");

const requiredFiles = [
  "00-goals-and-plan.md",
  "01-participant-handson.md",
  "02-instructor-guide.md",
  "03-challenges.md",
  path.join("slides", "kcl-frontend-2026.html"),
];

const failures = [];

async function readRequiredFile(relativePath) {
  const filePath = path.join(materialDir, relativePath);

  try {
    return await readFile(filePath, "utf8");
  } catch {
    failures.push(`Missing or unreadable: ${relativePath}`);
    return "";
  }
}

for (const relativePath of requiredFiles) {
  await readRequiredFile(relativePath);
}

const slideHtml = await readRequiredFile(path.join("slides", "kcl-frontend-2026.html"));
const slideCount = (slideHtml.match(/<section class="slide/g) ?? []).length;

if (slideCount < 20) {
  failures.push(`Expected at least 20 slides, found ${slideCount}`);
}

const requiredSlideSnippets = [
  "height: 100vh",
  "height: 100dvh",
  "overflow: hidden",
  "prefers-reduced-motion",
  "class DeckController",
  "IntersectionObserver",
];

for (const snippet of requiredSlideSnippets) {
  if (!slideHtml.includes(snippet)) {
    failures.push(`Slide deck is missing required snippet: ${snippet}`);
  }
}

if (slideHtml.includes("font-size: 8px") || slideHtml.includes("overflow: auto")) {
  failures.push("Slide deck contains a likely viewport-fit anti-pattern");
}

if (failures.length > 0) {
  console.error("Material verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Material verification passed. Slide count: ${slideCount}`);
