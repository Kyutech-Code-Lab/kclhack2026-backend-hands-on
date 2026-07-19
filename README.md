# KCL Shop ハンズオン

Next.js / React / TypeScript の基礎を、架空のショッピングアプリを作りながら学ぶ教材です。

この教材では **本格的なECサイト** は作りません。DB、認証、決済、Supabase、Prisma、API通信は扱わず、フロントエンドだけで完結させます。

## 2026年版の講座資料

今年の初回講座向けに、既存の完成アプリに加えて講座運用資料とHTMLスライドを追加しています。

```text
materials/2026/
  00-goals-and-plan.md
  01-participant-handson.md
  02-challenges.md
  03-challenge-answers.md
  99-instructor-guide.md
```

- `00-goals-and-plan.md`: 講座の目標、対象者、時間配分
- `01-participant-handson.md`: 参加者が当日手元で進める基本のハンズオン手順
- `02-challenges.md`: 早く終わった人、中級者向けの発展課題。必須ではありません
- `03-challenge-answers.md`: `02-challenges.md` の講師 / メンター向け解答メモ
- `99-instructor-guide.md`: 講師 / メンター向けの進行ガイド
- `slides/kcl-frontend-2026.html`: ブラウザで開ける投影用スライド

当日の参加者は、基本的に `01-participant-handson.md` だけを進めます。`02-challenges.md` は早く終わった人が各自で挑戦する発展課題として案内してください。

スライドは単体HTMLです。ファイルをブラウザで開くだけで使えます。

アプリと教材の検証は次のコマンドで行います。

```bash
cd web
npm run dev
```

## 1. この教材で作るもの

作るアプリは `KCL Shop` です。

当日の基本範囲は次のとおりです。

- 商品一覧ページ
- 商品詳細ページ
- 商品検索
- カテゴリ絞り込み

完成版には、次の発展的な機能も入っています。

- お気に入り機能
- カート風UI
- 注文フォーム風ページ
- JSON と XML のデータ形式比較

学習の中心は、Next.js のページ遷移、React のコンポーネントと状態管理、TypeScript の型定義です。

## 2. 完成形の説明

完成すると、トップページ `/` に商品一覧が表示されます。

商品カードには、商品名、価格、カテゴリ、画像、説明が表示されます。カード内のリンクから `/products/p001` のような商品詳細ページへ移動できます。

検索欄にキーワードを入力すると商品が絞り込まれ、カテゴリを選ぶとカテゴリでも絞り込めます。完成版では、お気に入りやカートの内容を `localStorage` に保存するため、ブラウザを再読み込みしても復元されます。`localStorage` は発展範囲です。

注文ページ `/order` では、名前、メールアドレス、住所、支払い方法、備考を入力できます。ただし実際の購入処理やDB保存は行わず、入力内容を画面に確認表示するだけです。

## 3. セットアップ

このリポジトリでは、Next.js アプリは `web/` ディレクトリにあります。

```bash
cd web
npm install
npm run dev
```

ブラウザで次のURLを開きます。

```text
http://localhost:3000
```

止めるときは、ターミナルで `Ctrl + C` を押します。

## 4. ファイル構成

この教材では、できるだけ追いやすい構成にしています。

```text
web/
  src/
    app/
      layout.tsx
      page.tsx
      products/
        [id]/
          page.tsx
      order/
        page.tsx

    components/
      ui/
        Button.tsx
        Input.tsx
        Select.tsx
        ProductCard.tsx
        Badge.tsx

      containers/
        Header.tsx
        ProductList.tsx
        ProductSearch.tsx
        CartSummary.tsx
        FavoriteProducts.tsx
        OrderForm.tsx

    data/
      products.ts

    types/
      product.ts
      cart.ts

    utils/
      formatPrice.ts
      productFilters.ts

    app/globals.css
```

`components/ui` は、ボタン、入力欄、カード、バッジなど、いろんな場所で使い回せる小さい部品を置く場所です。

`components/containers` は、商品一覧、検索エリア、カート表示など、複数のUI部品を組み合わせて1つの意味のある画面パーツにしたものを置く場所です。

## 5. 商品データを作る

まず、商品を表す型を作ります。

`src/types/product.ts`

```ts
export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  stock: number;
  rating: number;
};
```

カートに入れる商品は、商品そのものを丸ごと持つのではなく、商品IDと数量だけを持ちます。

`src/types/cart.ts`

```ts
export type CartItem = {
  productId: string;
  quantity: number;
};
```

次に、mock data を作ります。

`src/data/products.ts`

```ts
import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "p001",
    name: "ワイヤレスイヤホン",
    price: 3980,
    category: "ガジェット",
    description: "通学や作業中に使いやすい軽量イヤホン。",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    stock: 12,
    rating: 4.4,
  },
  // TODO: 商品をあと7件以上追加してみよう
];
```

考えるポイント:

- `id` は `string` なので、`"p001"` のようにクォートを付けます。
- カテゴリは最低4種類用意します。例: `ガジェット`、`ファッション`、`本`、`食品`

ヒント:

```text
商品データは配列です。1つの商品を表すオブジェクトを、カンマ区切りで増やします。
```

## 6. 商品カードを作る

先に、いろんな場所で使う小さなボタン部品を見ておきます。

`src/components/ui/Button.tsx`

```tsx
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button className="button" onClick={onClick} type="button">
      {children}
    </button>
  );
}
```

`children` には、コンポーネントの開始タグと終了タグの間に書いた中身が入ります。

```tsx
<Button>カートに追加</Button>
```

この場合、`children` は `"カートに追加"` です。

商品1件を表示するための `ProductCard` を作ります。

`src/components/ui/ProductCard.tsx`

```tsx
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
};

export function ProductCard({
  product,
  isFavorite,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>

      <Link href={`/products/${product.id}`}>
        詳細を見る
      </Link>

      <button onClick={() => onAddToCart(product.id)}>
        カートに追加
      </button>

      <button onClick={() => onToggleFavorite(product.id)}>
        {isFavorite ? "お気に入り済み" : "お気に入り"}
      </button>
    </article>
  );
}
```

考えるポイント:

- `ProductCard` は `product` を props として受け取ります。
- ボタンが押されたら、親コンポーネントから受け取った関数を呼び出します。

ヒント:

```text
子コンポーネントは「何をするか」を全部知る必要はありません。
ボタンが押されたことだけを親に伝えればOKです。
```

## 7. 商品一覧を表示する

商品一覧では `map` を使います。

`src/components/containers/ProductList.tsx`

```tsx
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";

type ProductListProps = {
  products: Product[];
  favoriteIds: string[];
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
};

export function ProductList({
  products,
  favoriteIds,
  onAddToCart,
  onToggleFavorite,
}: ProductListProps) {
  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={/* TODO: ここに1つの商品データを渡す */}
          isFavorite={favoriteIds.includes(product.id)}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}
```

ヒント:

```text
map の中では、1つずつの商品が product という変数に入っています。
```

`key={product.id}` は、React が「どの商品カードがどれか」を見分けるために必要です。

## 8. 商品詳細ページを作る

Next.js App Router では、ファイル名でURLが決まります。

```text
src/app/products/[id]/page.tsx
```

`[id]` は動的ルーティングです。たとえば `/products/p001` にアクセスすると、`id` に `"p001"` が入ります。

```tsx
import Link from "next/link";
import { products } from "@/data/products";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <main className="page-shell">
        <p>商品が見つかりませんでした。</p>
        <Link href="/">一覧へ戻る</Link>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Link href="/">一覧へ戻る</Link>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
```

考えるポイント:

- URLから受け取った `id` は `string` です。
- `products.find(...)` で、同じ `id` の商品を探します。

ヒント:

```text
商品データの id も string にしておくと、比較がシンプルになります。
```

## 9. 検索機能を作る

検索欄は `useState` で入力中の文字を管理します。

```tsx
"use client";

import { useState } from "react";

export function ProductSearch() {
  const [keyword, setKeyword] = useState("");

  return (
    <input
      value={keyword}
      onChange={(event) => setKeyword(event.target.value)}
      placeholder="商品名で検索"
    />
  );
}
```

これは controlled component です。

入力欄の値をブラウザ任せにせず、React の state で管理しています。

考えるポイント:

- `value` には現在の state を渡します。
- `onChange` で state を更新します。

## 10. カテゴリ絞り込みを作る

カテゴリも `useState` で管理します。

```tsx
const [selectedCategory, setSelectedCategory] = useState("all");
```

`select` の選択肢は、商品データからカテゴリ一覧を作ってもよいです。

```tsx
const categories = Array.from(new Set(products.map((product) => product.category)));
```

考えるポイント:

- `map` は配列から別の配列を作ります。
- `Set` は重複を消したいときに使えます。

ヒント:

```text
まずは固定で「すべて」「ガジェット」「ファッション」「本」「食品」と書いてもOKです。
```

## 11. useEffect で検索結果を更新する

`useEffect` は、状態が変わった後に、追加で何か処理したいときに使います。

この教材では、検索キーワードやカテゴリが変わった後に、表示する商品一覧を更新するために使います。

```tsx
const [keyword, setKeyword] = useState("");
const [selectedCategory, setSelectedCategory] = useState("all");
const [filteredProducts, setFilteredProducts] = useState(products);

useEffect(() => {
  const nextProducts = filterProducts(products, keyword, selectedCategory);
  setFilteredProducts(nextProducts);
}, [keyword, selectedCategory]);
```

考えるポイント:

- `keyword` が変わったら検索結果を更新します。
- `selectedCategory` が変わったら検索結果を更新します。

ヒント:

```text
useEffect の最後にある配列を「依存配列」と呼びます。
ここに入れた値が変わると、useEffect の中身がもう一度実行されます。
```

## 12. お気に入り機能を作る

お気に入りは、商品IDの配列として管理します。

```tsx
const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
```

追加・削除は、同じボタンで切り替えます。

```tsx
function handleToggleFavorite(productId: string) {
  setFavoriteIds((currentIds) => {
    if (currentIds.includes(productId)) {
      return currentIds.filter((id) => id !== productId);
    }

    return [...currentIds, productId];
  });
}
```

考えるポイント:

- すでに入っていたら `filter` で外します。
- 入っていなければ `...currentIds` で新しい配列を作ります。

ヒント:

```text
React の state は直接書き換えず、新しい配列を返します。
```

## 13. useEffect でお気に入りを localStorage に保存する

ページを再読み込みしてもお気に入りが残るように、`localStorage` を使います。

```tsx
useEffect(() => {
  const savedFavoriteIds = localStorage.getItem("kcl-shop-favorites");

  if (savedFavoriteIds) {
    setFavoriteIds(JSON.parse(savedFavoriteIds));
  }
}, []);
```

空の依存配列 `[]` は、ページ表示時に1回だけ実行したいときに使います。

保存するときも `useEffect` を使います。

```tsx
useEffect(() => {
  localStorage.setItem("kcl-shop-favorites", JSON.stringify(favoriteIds));
}, [favoriteIds]);
```

考えるポイント:

- `localStorage` はブラウザ側の機能です。
- `use client` が付いた Client Component の中で使います。

## 14. カート風UIを作る

カートは `CartItem[]` で管理します。

```tsx
import type { CartItem } from "@/types/cart";

const [cartItems, setCartItems] = useState<CartItem[]>([]);
```

カートに追加する関数です。

```tsx
function handleAddToCart(productId: string) {
  setCartItems((currentItems) => {
    const existingItem = currentItems.find((item) => item.productId === productId);

    if (existingItem) {
      return currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...currentItems, { productId, quantity: 1 }];
  });
}
```

考えるポイント:

- すでにカートにあれば数量を増やします。
- なければ新しい商品として追加します。

ヒント:

```text
map の中で、変更したい商品だけ新しいオブジェクトにします。
それ以外の商品はそのまま返します。
```

カートから削除するときは、削除したい商品ID以外を残します。

```tsx
function handleRemoveFromCart(productId: string) {
  setCartItems((currentItems) =>
    currentItems.filter((item) => item.productId !== productId)
  );
}
```

考えるポイント:

- `filter` は条件に合うものだけを残した新しい配列を作ります。
- ここでは「削除したいIDではない商品」だけを残しています。

## 15. useEffect でカートを localStorage に保存する

カートもお気に入りと同じ考え方です。

```tsx
useEffect(() => {
  const savedCartItems = localStorage.getItem("kcl-shop-cart");

  if (savedCartItems) {
    setCartItems(JSON.parse(savedCartItems));
  }
}, []);

useEffect(() => {
  localStorage.setItem("kcl-shop-cart", JSON.stringify(cartItems));
}, [cartItems]);
```

さらに、カートの件数に応じてタブのタイトルを変えてみます。

```tsx
useEffect(() => {
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  document.title =
    totalQuantity > 0 ? `KCL Shop (${totalQuantity})` : "KCL Shop";
}, [cartItems]);
```

考えるポイント:

- `reduce` は配列から合計値などを作るときに使えます。
- `document.title` もブラウザ側の機能なので Client Component の中で使います。

## 16. 注文フォーム風ページを作る

注文ページは `src/app/order/page.tsx` に作ります。

フォームでは、入力値を state で管理します。

```tsx
"use client";

import { useState } from "react";

type OrderFormValues = {
  name: string;
  email: string;
  address: string;
  paymentMethod: string;
  note: string;
};

export function OrderForm() {
  const [formValues, setFormValues] = useState<OrderFormValues>({
    name: "",
    email: "",
    address: "",
    paymentMethod: "credit-card",
    note: "",
  });

  function handleChange(name: keyof OrderFormValues, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  return (
    <form>
      <input
        value={formValues.name}
        onChange={(event) => handleChange("name", event.target.value)}
      />
    </form>
  );
}
```

考えるポイント:

- 入力欄ごとに state を作るのではなく、今回は1つのオブジェクトで管理します。
- `[name]: value` は、指定した項目だけを更新する書き方です。

ヒント:

```text
name を更新したいときは handleChange("name", event.target.value) と呼びます。
email なら "email" を渡します。
```

## 17. JSON と XML の違いを見る

今回のアプリでは、商品データを TypeScript の配列として書いています。これは、考え方としては JSON に近いデータ構造です。

JSON の例:

```json
{
  "id": "p001",
  "name": "ワイヤレスイヤホン",
  "price": 3980
}
```

XML の例:

```xml
<product>
  <id>p001</id>
  <name>ワイヤレスイヤホン</name>
  <price>3980</price>
</product>
```

JSON は、今のWebアプリでよく使われるデータ形式です。JavaScript と相性がよく、API のレスポンスでもよく見ます。

XML は、RSS、設定ファイル、一部のAPIなどでまだ使われています。タグでデータを囲むため、HTMLに少し似ています。

この教材では、XML をメイン実装には使いません。まずは React / Next.js で扱いやすい JSON 的なデータ構造に慣れることを優先します。

## 18. よくあるエラー

`npm install` していない:

```text
Cannot find module ...
```

対処:

```bash
cd web
npm install
```

`npm run dev` を実行していない:

```text
localhost:3000 にアクセスできない
```

対処:

```bash
cd web
npm run dev
```

import パスが違う:

```text
Module not found: Can't resolve ...
```

対処:

```ts
import { products } from "@/data/products";
```

`export` していない:

```text
Attempted import error: ... is not exported
```

対処:

```ts
export function Button() {}
```

`id` が string なのに number として比較している:

```ts
product.id === 1
```

対処:

```ts
product.id === "p001"
```

`class` ではなく `className` を使う:

```tsx
<div class="card">...</div>
```

対処:

```tsx
<div className="card">...</div>
```

`map` に `key` がない:

```tsx
{products.map((product) => (
  <ProductCard product={product} />
))}
```

対処:

```tsx
{products.map((product) => (
  <ProductCard key={product.id} product={product} />
))}
```

Client Component に `"use client"` がない:

```text
You're importing a component that needs useState/useEffect
```

対処:

```tsx
"use client";

import { useState } from "react";
```

`useState` / `useEffect` を Server Component で使おうとしている:

対処:

```text
useState や useEffect を使うファイルの先頭に "use client" を書きます。
```

`localStorage` を Server Component 側で触っている:

```text
localStorage is not defined
```

対処:

```text
localStorage はブラウザ側だけの機能です。
useEffect の中、かつ "use client" があるコンポーネントで使います。
```

## 19. 発展課題

ここから先は、早く終わった人や中級者向けの任意課題です。参加者全員が当日中に終える必要はありません。詳しい手順は `materials/2026/02-challenges.md` を見てください。

- 商品の並び替え
- 在庫ゼロ商品の表示
- お気に入りだけを見るフィルター
- 検索状態をURLに反映する
- mock data を JSON ファイルに切り出す
- `localStorage` 読み込みの型チェックを強化する
- 自分のハッカソンテーマに置き換える

## 最後に

この教材の目的は、完成アプリを丸暗記することではありません。

1つずつ小さな部品を作り、props、state、useEffect、map、filter、ページ遷移、動的ルーティングがどこで使われているかを確認しながら進めてください。
