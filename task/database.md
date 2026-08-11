# KCL☆Hack 2026 バックエンドハンズオン Database編

## 1. Supabaseプロジェクトの作成

Supabaseプロジェクトを作成しましょう

- Supabaseダッシュボードにて New Project を選択
- プロジェクト名とパスワードを入力
- Regionで `Northeast Asia (Tokyo)` を選択
- Securityで`Enable Data API`のチェックを外す
- Securityで`Enable automatic RLS`のチェックを外す


## 2. 環境変数の設定

```bash
cp .env.example .env
```

それぞれの値を埋めます
作成したプロジェクトを開き、`Connect`を選択。
環境変数は次の場所にあります。
- `DATABASE_URL`: ORM → Prisma → Configure ORM
- `DIRECT_URL`: ORM → Prisma → Configure ORM

`[YOUR-PASSWORD]`はプロジェクト作成時に設定したパスワードにします。

## 3. 実装

次の箇所を実装しましょう

### `prisma/schema.prisma` 13行目

`Product` テーブルの内容は次の通りです。
|カラム名|型|
| --- | --- |
| id | String |
| name | String |
| description | String |
| price | Int |
| category | String |
| imageUrl | String |
| stock | Int |
| rating | Float |

###  `scripts/db-playground.ts` 18, 35行目

`price` が 3000 以下の商品を `where` で絞るとき
```
const cheapProducts = await prisma.product.findMany({
    where: { price: { lte: 3000 }},
});
```

`rating`の降順で商品を並び替えて`rating`の値が大きい3件取得するとき

```
const topRated = await prisma.product.findMany({
    orderBy: { rating: "desc" },
    take: 3,
});
```

## 4. Prisma クライアントの作成

```bash
npx prisma generate
```

## 5. テーブルの作成と初期データの投入

`prisma/schema.prisma` で定義した情報を元にテーブルを作成します。

```bash
npx prisma db push
```

初期データが `prisma/products.ts` に用意されているため、作成したデータベースに投入します。

```bash
npx prisma db seed
```

## 6. テーブルの確認

次のコマンドを実行します
```bash
npx prisma studio
```

ターミナルに表示された URL を開きます。

Tables の Product を選択すると挿入したデータを確認できます。


次のコマンドを実行します
```bash
npx tsx scripts/db-playground.ts
```

情報を正確に取得できていることを確認します
