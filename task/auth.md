# KCL☆Hack 2026 バックエンドハンズオン Auth編

## 1. 現状の確認

```bash
npm run dev
```

http://localhost:3000 を開き、「カートに追加」を押したのちに、ページをリロードすると右上のカートに入っている商品数が0になることを確認しましょう。

## 2. Authenticationの確認
Supabaseのプロジェクトを開き、Authentication → URL Configuration → Site URL が `http://localhost:3000` になっていることを確認しましょう。

## 3. 実装

次の箇所を実装しましょう。

### `src/app/signup/actions.ts`

`signUp` でアカウントを作成できるようにしましょう。
10-18行目を次のように書き換えます。

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

ログインできるようにしましょう。
11-19行目を次のように書き換えます。

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

### `src/app/api/cart/route.ts` (GET)

`getClaims()` でログイン中のユーザーを確認し、ログインしていなければ 401 を返します。取得した `claims.sub` がユーザーIDです。
`GET` 関数内の最初にある (8行目付近) `userId` の宣言を削除して、次のように実装します。

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

関数内で先ほど削除した `userId` を使っている箇所は `claims.sub` に置き換えます。

### `src/app/api/cart/route.ts` (POST)

`getClaims()` でログイン中のユーザーを確認し、ログインしていなければ 401 を返します。取得した `claims.sub` がユーザーIDです。
`POST` 関数内の最初にある `userId` の宣言を削除して、次のように実装します。

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

関数内で先ほど削除した `userId` を使っている箇所は、`claims.sub` に置き換えます。

## 4. 動作確認

1. http://localhost:3000 を開きます。
2. ヘッダーの「ログイン」→「アカウントを作成する」を選択します。
3. メールアドレス(メールを確認できるもの)とパスワードを入力して、「アカウントを作成」をクリックします。
4. 届いた確認メールのリンクを開き、登録を完了します(届いたメールに `Confirm email address` と書かれているはずです)。
5. `http://localhost:3000` を開き、先ほどアカウント作成時に使用した情報を使ってログインします。
6. 商品を「カートに追加」できることを確認します。
7. リロードしてもカートの内容が残っていることを確認します。

### 確認メールが届かない場合

今回の設定だと、Supabaseは1時間に2通までしかメールを送信できません。そのためメール送信の上限に引っかかっている可能性があります。
手動でアカウントを作成する場合は次の手順に従ってください
1. Supabaseのプロジェクトを開く。
2. 「Authentication → Users → Add user → Create new user」を選択する。
3. 「Auto confirm user?」にチェックが入っていることを確認して、「Create user」を選択する。
これでアカウントを作成することができます。
