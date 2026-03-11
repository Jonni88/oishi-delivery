import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promotionSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function GET() {
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(promotions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = promotionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.promotion.create({
    data: { ...parsed.data, expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null }
  });
  return NextResponse.json(created, { status: 201 });
}
