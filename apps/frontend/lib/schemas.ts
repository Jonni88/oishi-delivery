import { z } from 'zod';

export const loginSchema = z.object({ login: z.string().min(1), password: z.string().min(1) });

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  price: z.number().int().min(0),
  pieces: z.number().int().min(0).optional().nullable(),
  image: z.string().url().optional().nullable(),
  isPopular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isSpicy: z.boolean().default(false)
});

export const orderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(6),
  deliveryType: z.enum(['delivery', 'pickup']),
  address: z.string().optional().nullable(),
  comment: z.string().optional().nullable(),
  paymentType: z.enum(['cash', 'transfer', 'terminal']),
  isScheduled: z.boolean().optional().default(false),
  scheduledAt: z.string().datetime().optional().nullable(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })).min(1)
});

export const settingsSchema = z.object({
  phone: z.string().min(6),
  address: z.string().optional().nullable(),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/),
  deliveryMinAmount: z.number().int().min(0),
  deliveryPrice: z.number().int().min(0),
  pickupTimeMinutes: z.number().int().min(1),
  acceptOrders: z.boolean().optional().default(true),
  statusMessage: z.string().optional().nullable()
});

export const statusSchema = z.object({
  status: z.enum(['новый', 'подтвержден', 'готовится', 'готов', 'выдан', 'доставлен', 'отменен'])
});

export const promotionSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  promoCode: z.string().optional().nullable(),
  discount: z.number().int().min(0).max(100).optional().nullable(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional().nullable()
});
