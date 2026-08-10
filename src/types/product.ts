export type ProductCategory = "ガジェット" | "ファッション" | "本" | "食品";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  stock: number;
  rating: number;
};
