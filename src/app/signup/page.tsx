import Link from "next/link";
import { Header } from "@/components/containers/Header";
import { signup } from "./actions";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error, message } = await searchParams;

  return (
    <div className="app-shell">
      <Header />
      <main className="simple-page">
        <section className="page-panel">
          <h1 className="section-title">アカウント作成</h1>

          {error === "failed" ? (
            <p className="muted-text">
              アカウントを作成できませんでした。メールアドレスとパスワード(6文字以上)を確認してください。
            </p>
          ) : null}
          {message === "sent" ? (
            <p className="muted-text">
              確認メールを送信しました。メール内のリンクを開いて確認を完了した後、
              <Link className="text-link" href="/login">
                ログイン
              </Link>
              してください。
            </p>
          ) : null}

          <form action={signup} className="form-grid">
            <label className="form-field form-field--full" htmlFor="email">
              <span className="form-field__label">メールアドレス</span>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                required
              />
            </label>

            <label className="form-field form-field--full" htmlFor="password">
              <span className="form-field__label">パスワード(6文字以上)</span>
              <input
                className="input"
                id="password"
                name="password"
                type="password"
                minLength={6}
                required
              />
            </label>

            <div className="form-field--full action-row">
              <button className="button button--primary" type="submit">
                アカウントを作成
              </button>
              <Link className="text-link" href="/login">
                ログインに戻る
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
