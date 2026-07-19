# 参加者向けハンズオン

## 今日作るもの

`KCL Shop` という小さなショッピングアプリを作ります。

できるようになること:

- 商品データを TypeScript で定義する
- 商品カードをコンポーネントとして作る
- `map` で商品一覧を表示する
- `useState` で検索キーワードを管理する
- `filter` で表示する商品を絞り込む
- `Link` で詳細ページへ移動する
- 余裕があれば、お気に入り、カート、注文フォームも作る

## セットアップ

```bash
cd web
npm install
npm run dev
```

ブラウザで開きます。

```text
http://localhost:3000
```

## 進め方

このリポジトリの `web` は完成版です。当日は講師の画面に合わせて、同じファイルを少しずつ作ります。迷ったら完成版の同じファイルを見て、どの部品がどこにあるかを確認してください。

## Phase 1: データの形を決める

見るファイル:

```text
src/types/product.ts
src/data/products.ts
```

商品1件の形を `type` で決めます。

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

チェックポイント:

- `name` は文字列なので `string`
- `price` は数値なので `number`
- 商品を増やすときは `{ ... }` の塊を配列に追加する
- `id` は詳細ページのURLにも使うので、他の商品と重複させない

## Phase 2: 商品カードを作る

見るファイル:

```text
src/components/ui/ProductCard.tsx
src/components/ui/Button.tsx
src/components/ui/Badge.tsx
```

商品カードは、1つの商品を受け取って表示する部品です。

```tsx
type ProductCardProps = {
  product: Product;
  onAddToCart: (productId: string) => void;
};
```

考え方:

- `product` は表示する商品データ
- `onAddToCart` はボタンを押したときに親へ知らせる関数
- 子コンポーネントは、カートの中身を全部知る必要はない

チェックポイント:

- `props` はコンポーネントに渡す入力
- `children` は `<Button>ここ</Button>` の中身
- ボタンの見た目は共通化し、押したときの処理だけ変える

## Phase 3: 商品一覧を表示する

見るファイル:

```text
src/components/containers/ProductList.tsx
```

配列の中の商品を、`map` でカードに変換します。

```tsx
{products.map((product) => (
  <ProductCard
    key={product.id}
    product={product}
    onAddToCart={onAddToCart}
  />
))}
```

チェックポイント:

- `map` は「配列から新しい配列を作る」
- React では一覧表示のとき `key` が必要
- `key` には重複しない `product.id` を使う

## Phase 4: 検索欄を作る

見るファイル:

```text
src/components/containers/ProductSearch.tsx
src/app/page.tsx
```

検索キーワードは `useState` で管理します。

```tsx
const [searchTerm, setSearchTerm] = useState("");
```

入力欄は React の state とつなぎます。

```tsx
<input
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>
```

チェックポイント:

- `value` は今の値
- `onChange` は入力が変わったときの処理
- `setSearchTerm` を呼ぶと画面が再表示される

## Phase 5: 絞り込みを作る

見るファイル:

```text
src/utils/productFilters.ts
src/app/page.tsx
```

検索とカテゴリの条件に合う商品だけを残します。

```ts
return products.filter((product) => {
  const matchesSearch = product.name.includes(searchTerm);
  const matchesCategory = selectedCategory === product.category;

  return matchesSearch && matchesCategory;
});
```

完成版では、空検索や「すべて」カテゴリも扱えるようにしています。

チェックポイント:

- `filter` は条件に合う要素だけを残す
- 検索では大文字小文字や空白も考える
- 条件が増えたら、1つずつ変数に分けると読みやすい

## Phase 6: 詳細ページへ移動する

見るファイル:

```text
src/app/products/[id]/page.tsx
src/components/ui/ProductCard.tsx
```

Next.js では `app/products/[id]/page.tsx` が `/products/好きなID` に対応します。

```tsx
<Link href={`/products/${product.id}`}>
  詳細を見る
</Link>
```

チェックポイント:

- ページ移動には `next/link` の `Link` を使う
- `[id]` はURLから変わる部分
- 詳細ページでは `params` から `id` を受け取る




↓ここまで終わって理解した人は発展課題に挑戦しましょう！


## Phase 7: お気に入りとカートを作る（余裕がある人向け）

見るファイル:

```text
src/app/page.tsx
src/components/containers/CartSummary.tsx
src/components/containers/FavoriteProducts.tsx
```

お気に入りは商品IDの配列として持ちます。

```tsx
const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
```

追加と削除では、元の配列を直接書き換えず、新しい配列を返します。

```tsx
return hasFavorite
  ? currentFavoriteIds.filter((id) => id !== productId)
  : [...currentFavoriteIds, productId];
```

チェックポイント:

- React の state は直接変更しない
- `filter` は削除にも使える
- `...currentFavoriteIds` は今の配列をコピーする書き方

## Phase 8: 注文フォームを作る（余裕がある人向け）

見るファイル:

```text
src/app/order/page.tsx
src/components/containers/OrderForm.tsx
```

フォーム入力も state で管理します。

```tsx
function updateField(field: keyof OrderFormData, value: string) {
  setFormData((currentFormData) => ({
    ...currentFormData,
    [field]: value,
  }));
}
```

チェックポイント:

- `keyof OrderFormData` は、`name` や `email` などの項目名だけを受け取る型
- `[field]: value` で指定した項目だけを更新する
- 送信時は `event.preventDefault()` でページ再読み込みを止める

## よくあるエラー

`npm install` をしていない:

```text
Cannot find module ...
```

`"use client"` がない:

```text
useState や useEffect を使うファイルの先頭に "use client" を書く
```

`class` と書いている:

```tsx
<div className="card">...</div>
```

`map` の `key` がない:

```tsx
<ProductCard key={product.id} product={product} />
```

`localStorage` を Server Component で使っている:

```text
localStorage は "use client" のあるファイルで、useEffect の中から使う
```

## 完成確認

最低限ここまで動けばOKです。

- 商品一覧が表示される
- 検索欄に文字を入れると表示が変わる
- カテゴリを選ぶと商品が絞り込まれる
- 商品カードから詳細ページへ移動できる

余裕がある人は、発展課題として `02-challenges.md` に進んでください。
