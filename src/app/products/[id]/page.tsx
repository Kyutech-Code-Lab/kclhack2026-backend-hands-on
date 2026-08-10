/* eslint-disable @next/next/no-img-element -- 初心者向け教材のため、Next Image の設定は扱いません。 */

import Link from "next/link";
import { Header } from "@/components/containers/Header";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/utils/formatPrice";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  // Server Component なので、API を経由せずデータベースへ直接クエリできます。
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return (
      <div className="app-shell">
        <Header />
        <main className="simple-page">
          <section className="page-panel">
            <h1 className="section-title">商品が見つかりませんでした</h1>
            <p className="muted-text">
              指定された商品 ID に一致するデータがありません。
            </p>
            <Link className="text-link" href="/">
              商品一覧に戻る
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="simple-page">
        <section className="detail-layout">
          <div className="detail-layout__image-wrap">
            <img
              alt={product.name}
              className="detail-layout__image"
              src={product.imageUrl}
            />
          </div>

          <div className="detail-layout__content">
            <Badge>{product.category}</Badge>
            <h1 className="page-title page-title--small">{product.name}</h1>
            <p className="price-text price-text--large">
              {formatPrice(product.price)}
            </p>
            <p className="page-description">{product.description}</p>
            <dl className="detail-list">
              <div>
                <dt>在庫</dt>
                <dd>{product.stock} 個</dd>
              </div>
              <div>
                <dt>評価</dt>
                <dd>{product.rating.toFixed(1)}</dd>
              </div>
            </dl>
            <div className="action-row">
              <Link className="text-link" href="/">
                商品一覧に戻る
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
