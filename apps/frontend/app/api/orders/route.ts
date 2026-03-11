import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { isOpenNow } from '@/lib/time';
import { orderSchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid order payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const products = await prisma.product.findMany({ where: { id: { in: parsed.data.items.map((i) => i.productId) } } });
  if (products.length === 0) {
    return NextResponse.json({ code: 'MENU_EMPTY', message: 'Меню пока пустое, заказ оформить нельзя.' }, { status: 400 });
  }

  const settings = await prisma.settings.findFirst();
  const opening = settings?.openingTime ?? '10:00';
  const closing = settings?.closingTime ?? '23:00';
  const status = isOpenNow(opening, closing);

  const requestedSchedule = parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null;
  const isScheduled = Boolean(parsed.data.isScheduled || requestedSchedule);

  if (!status.open && !isScheduled) {
    return NextResponse.json({
      code: 'RESTAURANT_CLOSED',
      message: `Сейчас закрыто. Откроемся в ${opening}`,
      details: 'Выберите время получения заказа.'
    }, { status: 400 });
  }

  if (isScheduled && !requestedSchedule) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Для отложенного заказа укажите scheduledAt' }, { status: 400 });
  }

  if (requestedSchedule && requestedSchedule.getTime() <= Date.now()) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'scheduledAt должен быть в будущем' }, { status: 400 });
  }

  const priceMap = new Map(products.map((p) => [p.id, p.price]));
  const total = parsed.data.items.reduce((sum, item) => sum + (priceMap.get(item.productId) ?? 0) * item.quantity, 0);

  const created = await prisma.order.create({
    data: {
      customerName: parsed.data.customerName,
      phone: parsed.data.phone,
      deliveryType: parsed.data.deliveryType,
      address: parsed.data.address,
      comment: parsed.data.comment,
      paymentType: parsed.data.paymentType,
      total,
      isScheduled,
      scheduledAt: requestedSchedule,
      items: {
        create: parsed.data.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: priceMap.get(i.productId) ?? 0
        }))
      }
    },
    include: { items: true }
  });

  return NextResponse.json(created, { status: 201 });
}
