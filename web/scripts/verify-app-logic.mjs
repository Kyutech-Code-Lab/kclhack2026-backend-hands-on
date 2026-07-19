import assert from "node:assert/strict";

const { products } = await import("../src/data/products.ts");
const { filterProducts, getProductCategories } = await import(
  "../src/utils/productFilters.ts"
);
const { formatPrice } = await import("../src/utils/formatPrice.ts");

assert.equal(products.length, 8, "Expected 8 sample products");

const categories = getProductCategories(products);
assert.deepEqual(categories, ["すべて", "ガジェット", "ファッション", "本", "食品"]);

const nextProducts = filterProducts(products, "next", "すべて");
assert.equal(nextProducts.length, 1);
assert.equal(nextProducts[0]?.name, "はじめての Next.js ノート");

const foodProducts = filterProducts(products, "", "食品");
assert.equal(foodProducts.length, 2);

const fashionBagProducts = filterProducts(products, "バッグ", "ファッション");
assert.equal(fashionBagProducts.length, 1);
assert.equal(fashionBagProducts[0]?.name, "キャンバストート");

assert.equal(formatPrice(6800), "￥6,800");

console.log("App logic verification passed.");
