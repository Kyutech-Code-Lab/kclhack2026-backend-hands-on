import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type RouteParams = {
  params: Promise<{ productId: string }>;
};

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return NextResponse.json(
      { error: "ログインが必要です。" },
      { status: 401 },
    );
  }

  const { productId } = await params;

  await prisma.favorite.deleteMany({
    where: { userId: claims.sub, productId },
  });

  return new NextResponse(null, { status: 204 });
}
