'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';

export default function CartSidebarClient() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4">
      <h3 className="text-lg font-semibold mb-2">Корзина</h3>
      {items.length === 0 ? (
        <p className="text-sm text-black/60">Добавь товары из меню</p>
      ) : (
        <>
          <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
            {items.map((i) => (
              <div key={i.id} className="rounded-xl border border-black/5 p-2">
                <div className="flex items-center gap-2">
                  <img src={i.image ?? '/menu/menu-01.jpg'} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-black/60">{i.price} ₽</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="h-6 w-6 rounded border" onClick={() => updateQuantity(i.id, i.quantity - 1)}>-</button>
                    <span className="text-sm">{i.quantity}</span>
                    <button className="h-6 w-6 rounded border" onClick={() => updateQuantity(i.id, i.quantity + 1)}>+</button>
                  </div>
                  <button className="text-xs text-red-600" onClick={() => removeItem(i.id)}>Убрать</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-black/10 pt-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Итого</span>
              <strong>{total} ₽</strong>
            </div>
            <Link href="/checkout" className="inline-block w-full rounded-xl bg-[#E10600] px-4 py-3 text-center text-sm font-medium text-white">
              Оформить заказ
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
