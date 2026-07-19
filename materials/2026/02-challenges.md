# 発展課題

早く終わった人、または中級者向けの追加課題です。バックエンドは使わず、フロントエンドだけで完結させます。

## Challenge 1: 商品を並び替える

目的:

- `useState`
- `sort`
- 元配列を直接変更しない考え方

仕様:

- 「おすすめ順」「価格が安い順」「価格が高い順」「評価が高い順」を選べる
- `products` の元データは直接変更しない
- 検索、カテゴリ絞り込みと一緒に動く

ヒント:

```ts
const sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
```

## Challenge 2: 在庫ゼロの商品を表示する

目的:

- 条件分岐
- UIの状態表現

仕様:

- `stock` が `0` の商品を1つ追加する
- 商品カードに「売り切れ」バッジを出す
- 売り切れ商品では「カートに追加」ボタンを無効にする

ヒント:

```tsx
<Button disabled={product.stock === 0}>
  カートに追加
</Button>
```

## Challenge 3: お気に入りだけを見るフィルター

目的:

- 複数 state の組み合わせ
- 配列の `includes`

仕様:

- 「お気に入りのみ」切り替えボタンを追加する
- ON のときは、お気に入り登録済みの商品だけ表示する
- 検索、カテゴリ絞り込みと同時に使える

ヒント:

```ts
const matchesFavorite =
  !showFavoritesOnly || favoriteIds.includes(product.id);
```

## Challenge 4: 検索状態をURLに反映する

目的:

- ハッカソンで共有しやすいURLを作る
- App Router の client-side navigation に慣れる

仕様:

- 検索キーワードを `?q=...` に反映する
- ページを開き直しても検索状態が復元される
- カテゴリも `?category=...` に入れてよい

使うもの:

```tsx
import { useRouter, useSearchParams } from "next/navigation";
```

注意:

- 初心者向け本編より少し難しい
- まずは検索キーワードだけでよい
- `useSearchParams` を使うコンポーネントは Client Component にする
- production build で止まる場合は、`Suspense` 境界で囲むか、検索URLを扱う部分を小さな Client Component に切り出す

## Challenge 5: 商品データをJSONファイルに切り出す

目的:

- JSON と TypeScript の違いを理解する
- 外部データ風の構成に近づける

仕様:

- `src/data/products.json` を作る
- `products.ts` から import して型を付ける
- 表示は今まで通り動かす

考えること:

- JSON ではコメントを書けない
- JSON では末尾カンマが使えない
- TypeScript の `Product[]` と組み合わせて安全に使う

## Challenge 6: `localStorage` 読み込みの型チェックを強化する

目的:

- `unknown` から安全に値を読む
- 実行時の型チェックを意識する

仕様:

- `readCartFromStorage` と `readFavoriteIdsFromStorage` を読む
- `isCartItem` と `isFavoriteIds` の役割を説明できるようにする
- 余裕があれば、無効なデータを `console.warn` する

考えること:

- `JSON.parse` の結果は信用しない
- TypeScript の型だけでは実行時エラーは防げない
- フロントエンドでも境界では入力チェックが必要

## Challenge 7: 自分のハッカソンテーマに置き換える

目的:

- 教材を自分のプロダクトに転用する

置き換え例:

| KCL Shop | ハッカソン応用 |
| --- | --- |
| 商品 | イベント、作品、ユーザー、タスク |
| カテゴリ | タグ、学部、難易度、状態 |
| カート | 選択リスト、比較リスト、お気に入り |
| 商品詳細 | 詳細ページ、プロフィール |

進め方:

1. `Product` 型の名前を、自分のテーマに合わせて変える
2. `products` の mock data を置き換える
3. カードに表示する項目を変える
4. 検索対象を変える
5. 詳細ページの文章を変える

最初から全部作り直さず、動いている構造を少しずつ置き換えるのが安全です。
