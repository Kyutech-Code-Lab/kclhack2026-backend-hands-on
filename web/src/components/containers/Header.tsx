import Link from "next/link";

type HeaderProps = {
  cartItemCount?: number;
  favoriteCount?: number;
};

export function Header({ cartItemCount, favoriteCount }: HeaderProps) {
  const shouldShowStatus =
    typeof cartItemCount === "number" || typeof favoriteCount === "number";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <Link className="site-header__title" href="/">
            KCL Shop
          </Link>
          <p className="site-header__subtitle">
            App Router と React Hooks を学ぶためのミニアプリ
          </p>
        </div>

        <nav className="site-header__nav">
          {shouldShowStatus ? (
            <div className="site-header__status">
              <span className="status-pill">カート {cartItemCount ?? 0}</span>
              <span className="status-pill">お気に入り {favoriteCount ?? 0}</span>
            </div>
          ) : 
            <Link className="text-link" href="/">
              商品一覧に戻る
            </Link>
          }
        </nav>
      </div>
    </header>
  );
}
