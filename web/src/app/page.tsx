"use client";

import { useEffect, useState } from "react";
import { CartSummary } from "@/components/containers/CartSummary";
import { FavoriteProducts } from "@/components/containers/FavoriteProducts";
import { Header } from "@/components/containers/Header";
import { ProductList } from "@/components/containers/ProductList";
import { ProductSearch } from "@/components/containers/ProductSearch";
import { products } from "@/data/products";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { filterProducts, getProductCategories } from "@/utils/productFilters";

const cartStorageKey = "kcl-shop-cart";
const favoritesStorageKey = "kcl-shop-favorites";
const categories = getProductCategories(products);
const jsonExample = `{
  "id": "p001",
  "name": "ワイヤレスイヤホン",
  "price": 3980
}`;
const xmlExample = `<product>
  <id>p001</id>
  <name>ワイヤレスイヤホン</name>
  <price>3980</price>
</product>`;

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "productId" in value &&
    typeof value.productId === "string" &&
    "quantity" in value &&
    typeof value.quantity === "number" &&
    Number.isFinite(value.quantity)
  );
}

function isFavoriteIds(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function readCartFromStorage(): CartItem[] {
  const savedCart = window.localStorage.getItem(cartStorageKey);

  if (!savedCart) {
    return [];
  }

  try {
    const parsedCart: unknown = JSON.parse(savedCart);
    return Array.isArray(parsedCart) ? parsedCart.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function readFavoriteIdsFromStorage(): string[] {
  const savedFavorites = window.localStorage.getItem(favoritesStorageKey);

  if (!savedFavorites) {
    return [];
  }

  try {
    const parsedFavorites: unknown = JSON.parse(savedFavorites);
    return isFavoriteIds(parsedFavorites) ? parsedFavorites : [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  // localStorage はブラウザだけで使えるため、ページ表示後に復元します。
  useEffect(() => {
    // 教材では useEffect の使い方を見せるため、ここで state に入れ直します。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(readCartFromStorage());
    setFavoriteIds(readFavoriteIdsFromStorage());
    setHasLoadedStorage(true);
  }, []);

  // 最初の復元が終わるまで、空の配列で保存データを上書きしないようにします。
  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems, hasLoadedStorage]);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    window.localStorage.setItem(favoritesStorageKey, JSON.stringify(favoriteIds));
  }, [favoriteIds, hasLoadedStorage]);

  // 検索キーワードやカテゴリが変わった後に、表示する商品を更新します。
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredProducts(filterProducts(products, searchTerm, selectedCategory));
  }, [searchTerm, selectedCategory]);

  const cartItemCount = cartItems.reduce(
    (totalQuantity, item) => totalQuantity + item.quantity,
    0,
  );

  useEffect(() => {
    document.title = cartItemCount > 0 ? `KCL Shop (${cartItemCount})` : "KCL Shop";
  }, [cartItemCount]);

  function handleAddToCart(productId: string) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === productId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { productId, quantity: 1 }];
    });
  }

  function handleToggleFavorite(productId: string) {
    setFavoriteIds((currentFavoriteIds) => {
      const hasFavorite = currentFavoriteIds.includes(productId);

      return hasFavorite
        ? currentFavoriteIds.filter((id) => id !== productId)
        : [...currentFavoriteIds, productId];
    });
  }

  function handleRemoveFromCart(productId: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }

  return (
    <div className="app-shell">
      <Header cartItemCount={cartItemCount} favoriteCount={favoriteIds.length} />

      <main className="page-content">
        <section className="hero-section">
          <div>
            <p className="eyebrow">Hands-on Lecture</p>
            <h1 className="page-title">Next.js ではじめるシンプルなショッピングアプリ</h1>
            <p className="page-description">
              検索、カテゴリ絞り込み、カート、お気に入り、注文フォームまでを
              App Router でひと通り試せる入門サンプルです。
            </p>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card">
              <span className="hero-stat-card__label">商品数</span>
              <strong className="hero-stat-card__value">{products.length}</strong>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-card__label">表示中</span>
              <strong className="hero-stat-card__value">{filteredProducts.length}</strong>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-card__label">カテゴリ</span>
              <strong className="hero-stat-card__value">{categories.length - 1}</strong>
            </div>
          </div>
        </section>

        <div className="content-grid">
          <section className="content-grid__main">
            <ProductSearch
              categories={categories}
              resultCount={filteredProducts.length}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onSearchChange={setSearchTerm}
            />
            <ProductList
              cartItems={cartItems}
              favoriteIds={favoriteIds}
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          </section>

          <aside className="content-grid__side">
            <CartSummary
              cartItems={cartItems}
              products={products}
              onRemoveFromCart={handleRemoveFromCart}
            />
            <FavoriteProducts favoriteIds={favoriteIds} products={products} />
          </aside>
        </div>
      </main>
    </div>
  );
}
