# KCL☆Hack 2026 バックエンドハンズオン API Route編

## 1. 環境変数の設定

`.env`ファイルにある次の値を設定します

- `NEXT_PUBLIC_SUPABASE_URL`: Framework → Next.js → App Router → Add files
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Framework → Next.js → App Router → Add files

## 2. 現状の確認

次のコマンドを実行します

```bash
npm run dev
```

http://localhost:3000 を開き、商品が何も表示されないことを確認します。


## 3. 実装

次の箇所を実装しましょう

### `src/app/api/products/route.ts`

`prisma.product.findMany()` で商品を全件取得し、`products` に代入します。

```ts
const products = await prisma.product.findMany();
```

発展: 余裕があれば `search` や `category` を使って、`where` で絞り込んでみましょう。

### `src/app/page.tsx` 39行目

`/api/products` を `fetch` し、取得した商品を `setProducts`・`setFilteredProducts` にセットします。

```ts
const response = await fetch("/api/products");
const data: Product[] = await response.json();
setProducts(data);
setFilteredProducts(data);
```

## 4. 動作確認

```bash
npm run dev
```

http://localhost:3000 を開き、商品が表示されることを確認します。
