// Prisma Client の基本的なクエリを試すスクリプトです。
// 実行: npx tsx scripts/db-playground.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // 1. 全件取得
  const allProducts = await prisma.product.findMany();
  console.log("--- 全商品 ---");
  console.log(allProducts.map((product) => product.name));

  // 2. 条件を付けて取得: 3000円以下の商品
  const cheapProducts = await prisma.product.findMany({
    where: { price: { lte: 3000 } },
  });
  console.log("--- 3000円以下の商品 ---");
  console.log(
    cheapProducts.map((product) => `${product.name}: ${product.price}円`),
  );

  // 3. id を指定して1件取得
  const speaker = await prisma.product.findUnique({
    where: { id: "gadget-speaker" },
  });
  console.log("--- id: gadget-speaker の商品 ---");
  console.log(speaker);

  // 4. 並び替え: 評価の高い順に3件
  const topRated = await prisma.product.findMany({
    orderBy: { rating: "desc" },
    take: 3,
  });
  console.log("--- 評価の高い商品トップ3 ---");
  console.log(
    topRated.map((product) => `${product.name}: ${product.rating}`),
  );

  // 5. 件数を数える
  const productCount = await prisma.product.count();
  console.log("--- 商品数 ---");
  console.log(productCount);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
