import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { statusSchema } from '@/lib/schemas';

const transitions: Record<string, string[]> = {
  'новый': ['подтвержден', 'отменен'],
  'подтвержден': ['готовится', 'отменен'],
  'готовится': ['готов', 'отменен'],
  'готов': ['выдан', 'доставлен'],
  'выдан': [],
  'доставлен': [],
  'отменен': []
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid status' }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ code: 'NOT_FOUND', message: 'Order not found' }, { status: 404 });

  const allowed = transitions[order.status] ?? [];
  if (!allowed.includes(parsed.data.status)) {
    return NextResponse.json({ code: 'INVALID_TRANSITION', message: `Cannot switch from ${order.status} to ${parsed.data.status}` }, { status: 400 });
  }

  const updated = await prisma.order.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json(updated);
}
