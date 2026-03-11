import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { settingsSchema } from '@/lib/schemas';

export async function GET() {
  const current = await prisma.settings.findFirst();
  return NextResponse.json(current);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  const current = await prisma.settings.findFirst();
  if (!current) {
    const created = await prisma.settings.create({ data: { ...parsed.data, restaurantName: 'Oishi' } });
    return NextResponse.json(created);
  }
  const updated = await prisma.settings.update({ where: { id: current.id }, data: parsed.data });
  return NextResponse.json(updated);
}
