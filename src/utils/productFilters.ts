import type { Product } from "@/types/product";

export function getProductCategories(products: Product[]): string[] {
  return ["すべて", ...new Set(products.map((product) => product.category))];
}
