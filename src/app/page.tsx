"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartSummary } from "@/components/containers/CartSummary";
import { FavoriteProducts } from "@/components/containers/FavoriteProducts";
import { Header } from "@/components/containers/Header";
import { ProductList } from "@/components/containers/ProductList";
import { ProductSearch } from "@/components/containers/ProductSearch";
import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { getProductCategories } from "@/utils/productFilters";

const fetchErrorMessage =
  "データを取得できませんでした。サーバーとデータベースの設定を確認してください。";

type FavoriteResponse = {
  productId: string;
};

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ページ表示時に、API から全商品を取得します。
  useEffect(() => {
    async function loadProducts() {
      try {
        // TODO(API): "/api/products" を fetch し、取得した商品を
        // setProducts と setFilteredProducts にセットしましょう
      } catch {
        setErrorMessage(fetchErrorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // ログイン状態の変化(セッションの読み込み完了)に合わせて、
  // 保存済みのカートとお気に入りを API から復元します。
  useEffect(() => {
    async function loadUserData() {
      try {
        const [cartResponse, favoritesResponse] = await Promise.all([
          fetch("/api/cart"),
          fetch("/api/favorites"),
        ]);

        // 401 はログインしていないだけなので、エラーにはしません。
        if (cartResponse.status === 401 || favoritesResponse.status === 401) {
          setIsLoggedIn(false);
          return;
        }

        if (!cartResponse.ok || !favoritesResponse.ok) {
          throw new Error("Failed to fetch cart or favorites");
        }

        const cartData: CartItem[] = await cartResponse.json();
        const favoriteData: FavoriteResponse[] = await favoritesResponse.json();

        setCartItems(
          cartData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        );
        setFavoriteIds(favoriteData.map((favorite) => favorite.productId));
      } catch {
        setErrorMessage(fetchErrorMessage);
      }
    }

    const supabase = createClient();

    // セッションが最初に読み込まれたとき(INITIAL_SESSION)や、
    // ログイン(SIGNED_IN)・ログアウト(SIGNED_OUT)の通知を受け取ります。
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        if (session) {
          setIsLoggedIn(true);
          loadUserData();
        } else {
          setIsLoggedIn(false);
        }
      }

      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setCartItems([]);
        setFavoriteIds([]);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // 検索ボタンが押されたら、検索条件付きで API を呼び直します。
  async function handleSearch() {
    const searchParams = new URLSearchParams();
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm) {
      searchParams.set("search", trimmedSearchTerm);
    }

    if (selectedCategory !== "すべて") {
      searchParams.set("category", selectedCategory);
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/products?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to search products: ${response.status}`);
      }

      setFilteredProducts(await response.json());
      setErrorMessage("");
    } catch {
      setErrorMessage(fetchErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const cartItemCount = cartItems.reduce(
    (totalQuantity, item) => totalQuantity + item.quantity,
    0,
  );

  useEffect(() => {
    document.title = cartItemCount > 0 ? `KCL Shop (${cartItemCount})` : "KCL Shop";
  }, [cartItemCount]);

  const categories = getProductCategories(products);

  async function handleAddToCart(productId: string) {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (!response.ok) {
      return;
    }

    const updatedItem: CartItem = await response.json();

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === productId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: updatedItem.quantity }
            : item,
        );
      }

      return [
        ...currentItems,
        { productId: updatedItem.productId, quantity: updatedItem.quantity },
      ];
    });
  }

  async function handleRemoveFromCart(productId: string) {
    const response = await fetch(`/api/cart/${productId}`, {
      method: "DELETE",
    });

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (!response.ok) {
      return;
    }

    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }

  async function handleToggleFavorite(productId: string) {
    const hasFavorite = favoriteIds.includes(productId);

    const response = hasFavorite
      ? await fetch(`/api/favorites/${productId}`, { method: "DELETE" })
      : await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (!response.ok) {
      return;
    }

    setFavoriteIds((currentFavoriteIds) =>
      hasFavorite
        ? currentFavoriteIds.filter((id) => id !== productId)
        : [...currentFavoriteIds, productId],
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
              検索、カテゴリ絞り込み、カート、お気に入りまでを
              ひと通り試せるサンプルアプリです。
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
              <strong className="hero-stat-card__value">
                {Math.max(categories.length - 1, 0)}
              </strong>
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
              onSearch={handleSearch}
              onSearchChange={setSearchTerm}
            />
            {errorMessage ? (
              <section className="panel">
                <p className="empty-state">{errorMessage}</p>
              </section>
            ) : isLoading ? (
              <section className="panel">
                <p className="empty-state">商品を読み込んでいます...</p>
              </section>
            ) : (
              <ProductList
                cartItems={cartItems}
                favoriteIds={favoriteIds}
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </section>

          <aside className="content-grid__side">
            {isLoggedIn ? (
              <>
                <CartSummary
                  cartItems={cartItems}
                  products={products}
                  onRemoveFromCart={handleRemoveFromCart}
                />
                <FavoriteProducts favoriteIds={favoriteIds} products={products} />
              </>
            ) : (
              <section className="summary-card">
                <div className="section-header">
                  <h2 className="section-title">カートとお気に入り</h2>
                </div>
                <p className="empty-state">
                  ログインすると、カートとお気に入りを使えます。
                </p>
                <Link className="text-link" href="/login">
                  ログインする
                </Link>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
