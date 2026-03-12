'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useCartStore } from '@/lib/cart-store';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
};

export default function CartSidebarClient({ products }: { products: Product[] }) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const recommendations = useMemo(() => {
    const ids = new Set(items.map((i) => i.id));
    return products.filter((p) => !ids.has(p.id)).slice(0, 6);
  }, [items, products]);

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Корзина</h3>
        {items.length > 0 && (
          <button onClick={clearCart} className="text-sm text-black/50 hover:text-black">
            Очистить
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/20 p-4 text-sm text-black/60">Добавь товары из меню</p>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.id} className="rounded-xl border border-black/10 p-2">
                <div className="flex items-start gap-2">
                  <img src={i.image ?? '/menu/menu-01.jpg'} alt={i.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    <p className="line-clamp-2 text-xs text-black/50">{i.description ?? 'Свежий ролл из премиальных ингредиентов'}</p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <strong className="text-xl">{i.price} ₽</strong>
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 rounded-lg border border-black/15 text-lg leading-none" onClick={() => updateQuantity(i.id, i.quantity - 1)}>
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{i.quantity}</span>
                    <button className="h-8 w-8 rounded-lg border border-black/15 text-lg leading-none" onClick={() => updateQuantity(i.id, i.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recommendations.length > 0 && (
            <div className="mt-4 border-t border-black/10 pt-4">
              <h4 className="mb-2 text-lg font-semibold">Добавьте ещё</h4>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {recommendations.map((p) => (
                  <div key={p.id} className="min-w-[120px] rounded-xl border border-black/10 p-2">
                    <img src={p.image ?? '/menu/menu-01.jpg'} alt={p.name} className="h-16 w-full rounded-lg object-cover" />
                    <p className="mt-1 line-clamp-2 text-xs font-medium">{p.name}</p>
                    <p className="text-sm font-semibold">{p.price} ₽</p>
                    <button
                      onClick={() =>
                        addItem({
                          id: p.id,
                          name: p.name,
                          price: p.price,
                          image: p.image,
                          description: p.description,
                          restaurantId: 'oishi',
                          restaurantName: 'Oishi',
                          quantity: 1,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-black/15 py-1 text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-2 border-t border-black/10 pt-4">
            <p className="text-sm text-black/60">Минимальная сумма заказа: 1200 ₽</p>
            <Link href="/checkout" className="flex w-full items-center justify-between rounded-xl bg-black px-4 py-3 text-sm font-medium text-white">
              <span>К оформлению</span>
              <strong>{total} ₽</strong>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
