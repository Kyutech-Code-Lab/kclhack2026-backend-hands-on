import Link from "next/link";
import { Header } from "@/components/containers/Header";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="app-shell">
      <Header />
      <main className="simple-page">
        <section className="page-panel">
          <h1 className="section-title">ログイン</h1>

          {error === "invalid" ? (
            <p className="muted-text">
              メールアドレスまたはパスワードが正しくありません。
            </p>
          ) : null}
          {error === "confirm" ? (
            <p className="muted-text">
              メールの確認に失敗しました。リンクの有効期限が切れている可能性があります。
            </p>
          ) : null}

          <form action={login} className="form-grid">
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
              <span className="form-field__label">パスワード</span>
              <input
                className="input"
                id="password"
                name="password"
                type="password"
                required
              />
            </label>

            <div className="form-field--full action-row">
              <button className="button button--primary" type="submit">
                ログイン
              </button>
              <Link className="text-link" href="/signup">
                アカウントを作成する
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
