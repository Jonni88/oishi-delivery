import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/schemas';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  const updated = await prisma.product.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
