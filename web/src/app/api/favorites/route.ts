import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 講座2で、ログインしているユーザーの ID に置き換えます。
const userId = "demo-user";

export async function GET() {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディが JSON ではありません。" },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("productId" in body) ||
    typeof body.productId !== "string"
  ) {
    return NextResponse.json(
      { error: "productId が必要です。" },
      { status: 400 },
    );
  }

  // すでに登録済みならそのまま返します(200)。
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: { userId, productId: body.productId },
    },
  });

  if (existingFavorite) {
    return NextResponse.json(existingFavorite);
  }

  // 登録します(201)。create ではなく upsert を使うことで、
  // 同時に 2 つのリクエストが来ても一意制約エラーになりません。
  const createdFavorite = await prisma.favorite.upsert({
    where: {
      userId_productId: { userId, productId: body.productId },
    },
    update: {},
    create: { userId, productId: body.productId },
  });

  return NextResponse.json(createdFavorite, { status: 201 });
}
