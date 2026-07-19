import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 講座2で、ログインしているユーザーの ID に置き換えます。
const userId = "demo-user";

type RouteParams = {
  params: Promise<{ productId: string }>;
};

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { productId } = await params;

  await prisma.favorite.deleteMany({
    where: { userId, productId },
  });

  return new NextResponse(null, { status: 204 });
}
