import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types/product";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search");
  const category = request.nextUrl.searchParams.get("category");

  // TODO(API): prisma.product.findMany() で商品を取得しましょう
  // 発展: 余裕があれば search や category を使って絞り込んでみましょう
  const products: Product[] = [];

  return NextResponse.json(products);
}
