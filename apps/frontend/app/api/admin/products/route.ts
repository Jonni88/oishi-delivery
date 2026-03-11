import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/schemas';

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
