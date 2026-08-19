# KCL☆Hack 2026 バックエンドハンズオン Database編

## 1. Supabaseのアカウント作成

Supabaseのアカウントを持ってない人は以下のURLからアカウント作成する
https://supabase.com/dashboard/sign-up

Supabaseのアカウントを持っている人は以下のURLからログインする
https://supabase.com/dashboard/sign-in

## 2. Supabaseプロジェクトの作成

1. `+ New organization` を押す (Organizationを元々持っている人はそれを使っても良い)
2. 以下の設定でOrganizationを作成:
   - **Name:** 自由(KCLなど)
   - **Type:** Personal
   - **Plan:** Free - $0/month
3. `Create organization` を押す
4. Supabaseダッシュボードにて `New Project` を選択する
5. 以下の設定でプロジェクトを作成:
   - **プロジェクト名:** 自由 (kclhack2026など)
   - **Database password:** パスワードを入力 (パスワードは後で使用する)
   - **Region:** `Northeast Asia (Tokyo)` を選択
   - **Security:** `Enable Data API` のチェックを外す
   - **Security:** `Enable automatic RLS` のチェックを外す
6. `Create new project` を押す

## 3. 環境変数の設定

1. 作業するフォルダを作成し、リポジトリを取得してインストールを行う
   ```bash
   mkdir ~/workspace
   cd ~/workspace
   git clone -b handson git@github.com:Kyutech-Code-Lab/kclhack2026-backend-hands-on.git
   cd kclhack2026-backend-hands-on
   npm ci
   ```

2. `.env.example` をコピーして `.env` を作成

    ```bash
    cp .env.example .env
    ```

3. プロジェクトを開き、`Connect` を選択する。
   `ORM` → `Prisma` → `Configure ORM` の順に開き、以下の環境変数をコピーする。

   - `DATABASE_URL`
   - `DIRECT_URL`

4. `.env` を開き、値の `[YOUR-PASSWORD]` の部分をプロジェクト作成時に設定したパスワードに変更する。

## 4. 実装(スキーマの定義)

`prisma/schema.prisma` 13行目の `Product` (商品) テーブルの設計図を定義する。

| カラム名    | 型     |
| ----------- | ------ |
| id          | String |
| name        | String |
| description | String |
| price       | Int    |
| category    | String |
| imageUrl    | String |
| stock       | Int    |
| rating      | Float  |

## 5. Prisma Client の作成

Prisma Client を作成する。

```bash
npx prisma generate
```

## 6. テーブルの作成と初期データの投入

定義した設計図を元に、実際のデータベースにテーブルを構築する。

```bash
# Supabaseにテーブルを作成-`prisma/schema.prisma` で定義した情報を元にテーブルを作成する。
npx prisma db push
# 用意された初期データを投入-初期データが `prisma/products.ts` に用意されているため、作成したデータベースに投入する。
npx prisma db seed
```

## 7. テーブルの確認

データが正しくSupabaseに保存されたか、Prisma Studio (GUI)で確認する。

```bash
npx prisma studio
```

ターミナルに表示された URL を開き、Tables の `Product` を選択し、商品データが入っていることを確認する。

## 8. 実装(データの取得テスト)

### 8.1 データの取得テスト (price)

`scripts/db-playground.ts` 20行目を実装する。

- **TODO:** `price` が3000以下の商品を `where` で絞り込みする。
- **公式ドキュメント:** https://www.prisma.io/docs/orm/reference/prisma-client-reference

### 8.2 データの取得テスト (rating)

`scripts/db-playground.ts` 35行目を実装する。

- **TODO:** `rating` の降順で並び替え、`take` でratingの値が大きい3件を絞る。
- **公式ドキュメント:** https://www.prisma.io/docs/orm/reference/prisma-client-reference
---

### ヒント1: Prismaの比較演算子（8.1向け）

`where` を使って数値を絞り込む場合、以下のような特別な演算子を使用する。表を参考に「3000以下」を表す演算子を使う。\
スライドの「03 Prismaでの実装方法」に5000円以上の商品の絞り込み例があるので参考にする。

| 演算子 | 意味 | 英語の由来 |
| --- | --- | --- |
| **equals** | 等しい | - |
| **not** | 等しくない | - |
| **gt** | より大きい (>) | Greater Than |
| **gte** | 以上 (>=) | Greater Than or Equal |
| **lt** | 未満 (<) | Less Than |
| **lte** | 以下 (<=) | Less Than or Equal |

### ヒント2: データの並び替えと件数制限（8.2向け）

* **並び替え (`orderBy`)**: 指定したカラムを基準にデータを並び替える。小さい順（昇順）は `"asc"`、大きい順（降順）は `"desc"` を指定する。
* **件数の絞り込み (`take`)**: 取得するデータの最大件数を数値で指定する。

## 9. 動作確認

実装(データの取得テスト)でPrisma Client の基本的なクエリを試すスクリプトが完成したなら、以下のコマンドを実行する。

```bash
npx tsx scripts/db-playground.ts
```

ターミナル上で、条件通りにデータベースから情報を取得できていることが確認できればハンズオン完了。
