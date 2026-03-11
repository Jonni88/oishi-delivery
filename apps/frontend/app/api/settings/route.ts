import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const settings = await prisma.settings.findFirst();
  return NextResponse.json(settings);
}
