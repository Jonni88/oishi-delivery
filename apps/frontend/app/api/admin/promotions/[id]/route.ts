import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promotionSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = promotionSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  const updated = await prisma.promotion.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : parsed.data.expiresAt === null ? null : undefined
    }
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.promotion.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
