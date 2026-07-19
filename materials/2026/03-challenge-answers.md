# チャレンジ解答メモ

このファイルは参加者向けではありません。メンター / 講師が `02-challenges.md` の解答例や説明方針を確認するための内部資料です。

## Challenge 1: 商品を並び替える

考え方:

- 並び順そのものを state で持つ
- `filteredProducts` を直接 `sort` せず、コピーした配列を並び替える
- `price` や `rating` の差を `sort` の比較関数に使う

実装例:

```tsx
const [sortOrder, setSortOrder] = useState("featured");

const sortedProducts = [...filteredProducts].sort((a, b) => {
  switch (sortOrder) {
    case "price-asc":
      return a.price - b.price;
    case "price-desc":
      return b.price - a.price;
    case "rating-desc":
      return b.rating - a.rating;
    default:
      return 0;
  }
});
```

補足:

- `sort` は元配列を変更するので、必ず `[...filteredProducts]` を作る
- 初心者には「表示用の配列を別で作る」と説明すると通りやすい

## Challenge 2: 在庫ゼロの商品を表示する

考え方:

- `products.ts` に `stock: 0` の商品を 1 件追加する
- `ProductCard` で `product.stock === 0` を条件に表示を変える

実装例:

```tsx
{product.stock === 0 ? <Badge>売り切れ</Badge> : <Badge>{product.category}</Badge>}

<Button
  disabled={product.stock === 0}
  onClick={() => onAddToCart(product.id)}
>
  カートに追加
</Button>
```

補足:

- カテゴリバッジを残して、売り切れバッジを追加してもよい
- `Button` コンポーネントが `disabled` を受け取れない場合は props を拡張する

## Challenge 3: お気に入りだけを見るフィルター

考え方:

- `showFavoritesOnly` という `boolean` の state を追加する
- `filterProducts` の結果に加えて、お気に入り条件でも絞る

実装例:

```tsx
const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

const visibleProducts = filteredProducts.filter((product) => {
  if (!showFavoritesOnly) {
    return true;
  }

  return favoriteIds.includes(product.id);
});
```

補足:

- `filterProducts` の中に favorite 条件まで入れるより、画面側で 1 回追加の `filter` をかけるほうが説明しやすい

## Challenge 4: 検索状態を URL に反映する

考え方:

- `useRouter`, `useSearchParams` を使う
- 初期表示時に URL から `q` と `category` を読む
- state が変わったら URL を更新する

実装例:

```tsx
const router = useRouter();
const searchParams = useSearchParams();

useEffect(() => {
  const params = new URLSearchParams(searchParams.toString());

  if (searchTerm) {
    params.set("q", searchTerm);
  } else {
    params.delete("q");
  }

  if (selectedCategory !== "すべて") {
    params.set("category", selectedCategory);
  } else {
    params.delete("category");
  }

  const queryString = params.toString();
  router.replace(queryString ? `/?${queryString}` : "/");
}, [router, searchParams, searchTerm, selectedCategory]);
```

補足:

- まずは `q` だけでもよい
- 無限ループの説明は難しいので、初心者相手なら「URL 更新用の effect」と割り切ってよい
- production build で `useSearchParams` 周りのエラーが出る場合は、該当部分を小さな Client Component に切り出して `Suspense` 境界で囲む

## Challenge 5: 商品データを JSON に切り出す

考え方:

- `src/data/products.json` を追加する
- `products.ts` から import して `Product[]` として扱う

実装例:

```ts
import productsData from "./products.json";
import type { Product } from "@/types/product";

export const products = productsData as Product[];
```

補足:

- 本当は `as Product[]` より実行時バリデーションが望ましい
- 初回講座の発展課題としては、JSON と TS の違いを理解できれば十分

## Challenge 6: `localStorage` 読み込みの型チェックを強化する

考え方:

- `unknown` を受けて、自前の type guard で判定する
- 無効なデータは空配列へフォールバックする

実装例:

```ts
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
```

補足:

- TypeScript の型は実行前に消えるので、`JSON.parse` の結果は別で検証が必要
- 「外から入る値は信用しない」という話につなげやすい

## Challenge 7: ハッカソンテーマへ置き換える

考え方:

- `Product` をそのまま別ドメインへ読み替える
- 一覧、詳細、検索の構造はそのまま使える

置き換え例:

- 商品 -> イベント
- カテゴリ -> タグ
- お気に入り -> 参加候補
- カート -> 比較リスト

説明のコツ:

- 最初に型名を置き換える
- 次に mock data を置き換える
- 最後にカード表示の文言を変える

この順番だと、見た目だけ変えるより構造の再利用が伝わりやすいです。
