import type { Product } from "@/types/product";

export function getProductCategories(products: Product[]): string[] {
  return ["すべて", ...new Set(products.map((product) => product.category))];
}

export function filterProducts(
  products: Product[],
  searchTerm: string,
  selectedCategory: string,
): Product[] {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      normalizedSearchTerm === "" ||
      product.name.toLowerCase().includes(normalizedSearchTerm) ||
      product.description.toLowerCase().includes(normalizedSearchTerm) ||
      product.category.toLowerCase().includes(normalizedSearchTerm);

    const matchesCategory =
      selectedCategory === "すべて" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}
