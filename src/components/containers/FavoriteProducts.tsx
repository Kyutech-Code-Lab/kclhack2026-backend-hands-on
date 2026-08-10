import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatPrice";

type FavoriteProductsProps = {
  favoriteIds: string[];
  products: Product[];
};

export function FavoriteProducts({
  favoriteIds,
  products,
}: FavoriteProductsProps) {
  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  );

  return (
    <section className="favorite-card">
      <div className="section-header">
        <h2 className="section-title">お気に入り</h2>
        <p className="section-caption">{favoriteProducts.length} 件</p>
      </div>

      {favoriteProducts.length === 0 ? (
        <p className="empty-state">
          お気に入り登録した商品がここに表示されます。
        </p>
      ) : (
        <ul className="favorite-list">
          {favoriteProducts.map((product) => (
            <li className="favorite-list__item" key={product.id}>
              <div>
                <Link className="favorite-list__link" href={`/products/${product.id}`}>
                  {product.name}
                </Link>
                <p className="muted-text">{product.category}</p>
              </div>
              <span>{formatPrice(product.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
