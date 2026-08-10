import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return NextResponse.json(
      { error: "ログインが必要です。" },
      { status: 401 },
    );
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: claims.sub },
  });

  return NextResponse.json(cartItems);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return NextResponse.json(
      { error: "ログインが必要です。" },
      { status: 401 },
    );
  }

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

  // すでにカートにあれば数量を 1 増やし、なければ数量 1 で追加します。
  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId: { userId: claims.sub, productId: body.productId },
    },
    update: { quantity: { increment: 1 } },
    create: { userId: claims.sub, productId: body.productId, quantity: 1 },
  });

  // 数量が 1 なら新規作成(201)、2 以上なら既存の数量を増やした更新(200)です。
  return NextResponse.json(cartItem, {
    status: cartItem.quantity === 1 ? 201 : 200,
  });
}
