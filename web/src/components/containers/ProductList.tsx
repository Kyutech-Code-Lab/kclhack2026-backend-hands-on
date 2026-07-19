import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";

type ProductListProps = {
  products: Product[];
  cartItems: CartItem[];
  favoriteIds: string[];
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
};

export function ProductList({
  products,
  cartItems,
  favoriteIds,
  onAddToCart,
  onToggleFavorite,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <section className="panel">
        <div className="section-header">
          <h2 className="section-title">商品一覧</h2>
        </div>
        <p className="empty-state">
          条件に合う商品がありません。検索キーワードやカテゴリを変えてみてください。
        </p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="section-header">
        <h2 className="section-title">商品一覧</h2>
        <p className="section-caption">{products.length} 件を表示中</p>
      </div>

      <div className="products-grid">
        {/* map を使うと、配列の中身を 1 件ずつ ProductCard に変換できます。 */}
        {products.map((product) => {
          const cartItem = cartItems.find((item) => item.productId === product.id);

          return (
            <ProductCard
              cartQuantity={cartItem?.quantity ?? 0}
              isFavorite={favoriteIds.includes(product.id)}
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
            />
          );
        })}
      </div>
    </section>
  );
}
