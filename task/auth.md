# KCL☆Hack 2026 バックエンドハンズオン Auth編

## 1. 現状の確認

```bash
npm run dev
```

http://localhost:3000 を開き、「カートに追加」を押したのちに、ページをリロードするとカート情報が消えることを確認しましょう。

## 2. ### Authenticationの確認
Supabaseのプロジェクトを開き
Authentication → URL Configuration → Site URL が `http://localhost:3000`を指していることを確認する

## 2. 実装

次の箇所を実装しましょう

### `src/app/signup/actions.ts`

`signUp` でアカウントを作成できるようにしましょう。

```ts
const email = String(formData.get("email"));
const password = String(formData.get("password"));

const { error } = await supabase.auth.signUp({
  email,
  password,
});

if (error) {
  redirect("/signup?error=failed");
}
```


### `src/app/login/actions.ts`

ログインできるようにしましょう

```ts
const email = String(formData.get("email"));
const password = String(formData.get("password"));

const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  redirect("/login?error=invalid");
}
```

### `src/app/api/cart/route.ts`(GET・POST)

`getClaims()` でログイン中のユーザーを確認し、ログインしていなければ 401 を返します。取得した `claims.sub` がユーザーIDです。GET・POST の両方に実装しましょう。

```ts
const supabase = await createClient();
const { data } = await supabase.auth.getClaims();
const claims = data?.claims;

if (!claims) {
  return NextResponse.json(
    { error: "ログインが必要です。" },
    { status: 401 },
  );
}
```

`userId` を使っている箇所は `claims.sub` に置き換えます。

### `src/app/page.tsx` の `handleAddToCart` 関数

カート追加のリクエストが 401 を返したら、`/login` にリダイレクトします。

```ts
if (response.status === 401) {
  router.push("/login");
  return;
}
```

## 3. 動作確認

```bash
npm run dev
```

1. ヘッダーの「ログイン」→「アカウントを作成する」からサインアップします
2. Supabase に登録したものと同じメールアドレスを使いましょう
3. 届いた確認メールのリンクを開き、登録を完了します
4. ログインし、商品を「カートに追加」できることを確認します
5. リロードしてもカートの内容が残っていることを確認します

## 発展

時間に余裕がある人は、次にも挑戦してみましょう。

- `src/app/api/cart/[productId]/route.ts`(DELETE)・`src/app/api/favorites/route.ts`・`src/app/api/favorites/[productId]/route.ts` に、同じ認証チェックを実装する
- `src/app/page.tsx` の `handleRemoveFromCart`・`handleToggleFavorite` にも 401 のリダイレクトを実装する
