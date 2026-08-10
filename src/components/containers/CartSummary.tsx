import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatPrice";

type CartSummaryProps = {
  cartItems: CartItem[];
  products: Product[];
  onRemoveFromCart: (productId: string) => void;
};

export function CartSummary({
  cartItems,
  products,
  onRemoveFromCart,
}: CartSummaryProps) {
  const detailedCartItems = cartItems
    .map((item) => {
      const product = products.find(
        (currentProduct) => currentProduct.id === item.productId,
      );

      return product ? { ...item, product } : null;
    })
    .filter(
      (
        item,
      ): item is CartItem & {
        product: Product;
      } => item !== null,
    );

  const totalPrice = detailedCartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <section className="summary-card">
      <div className="section-header">
        <h2 className="section-title">カート</h2>
        <p className="section-caption">{cartItems.length} 種類</p>
      </div>

      {detailedCartItems.length === 0 ? (
        <p className="empty-state">
          まだ商品が入っていません。気になる商品をカートに追加してみましょう。
        </p>
      ) : (
        <>
          <ul className="summary-list">
            {detailedCartItems.map((item) => (
              <li className="summary-list__item" key={item.productId}>
                <div>
                  <span>{item.product.name}</span>
                  <p className="muted-text">
                    {item.quantity} 個 / {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
                <button
                  className="text-button"
                  onClick={() => onRemoveFromCart(item.productId)}
                  type="button"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>

          <div className="summary-total">
            <span>合計</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </>
      )}
    </section>
  );
}
