/* eslint-disable @next/next/no-img-element -- 初心者向け教材のため、Next Image の設定は扱いません。 */

import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import type { Product } from "@/types/product";
import { Badge } from "./Badge";
import { Button } from "./Button";

type ProductCardProps = {
  product: Product;
  cartQuantity: number;
  isFavorite: boolean;
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
};

export function ProductCard({
  product,
  cartQuantity,
  isFavorite,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <img
        alt={product.name}
        className="product-card__image"
        src={product.imageUrl}
      />

      <div className="product-card__body">
        <div className="product-card__top">
          <Badge>{product.category}</Badge>
          {cartQuantity > 0 ? (
            <span className="cart-chip">カート内: {cartQuantity}</span>
          ) : null}
        </div>

        <div>
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__description">{product.description}</p>
          <p className="product-card__meta">
            評価 {product.rating.toFixed(1)} / 在庫 {product.stock} 個
          </p>
        </div>

        <div className="product-card__footer">
          <span className="price-text">{formatPrice(product.price)}</span>
          <Link className="text-link" href={`/products/${product.id}`}>
            詳細を見る
          </Link>
        </div>

        <div className="action-row">
          <Button onClick={() => onAddToCart(product.id)}>カートに追加</Button>
          <Button
            ariaPressed={isFavorite}
            onClick={() => onToggleFavorite(product.id)}
            variant="ghost"
          >
            {isFavorite ? "お気に入り解除" : "お気に入り"}
          </Button>
        </div>
      </div>
    </article>
  );
}
