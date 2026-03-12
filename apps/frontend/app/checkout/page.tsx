'use client';

import { useMemo, useState } from 'react';
import { useCartStore } from '@/lib/cart-store';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = getTotalPrice();
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount);

  const promoHint = useMemo(() => {
    if (!promo) return 'Введите промокод, например OISHI10';
    if (promoApplied) return 'Промокод применён: скидка 10%';
    return 'Промокод не применён';
  }, [promo, promoApplied]);

  return (
    <main className="min-h-screen p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Корзина и оформление</h1>

      {items.length === 0 ? (
        <div className="card p-6 text-center text-black/60">Корзина пустая</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <section className="card p-4 space-y-3">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-3 border-b border-black/5 pb-3 last:border-0">
                <img src={i.image ?? '/menu/menu-01.jpg'} alt={i.name} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-black/60">{i.price} ₽</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-7 w-7 rounded border" onClick={() => updateQuantity(i.id, i.quantity - 1)}>-</button>
                  <span>{i.quantity}</span>
                  <button className="h-7 w-7 rounded border" onClick={() => updateQuantity(i.id, i.quantity + 1)}>+</button>
                </div>
                <button className="text-xs text-red-600" onClick={() => removeItem(i.id)}>Удалить</button>
              </div>
            ))}
          </section>

          <aside className="card p-4 space-y-3 h-fit">
            <h2 className="text-lg font-semibold">Итог</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Сумма</span><span>{subtotal} ₽</span></div>
              <div className="flex justify-between text-green-700"><span>Скидка</span><span>-{discount} ₽</span></div>
              <div className="flex justify-between text-base font-bold"><span>К оплате</span><span>{total} ₽</span></div>
            </div>

            <div className="rounded-xl border border-black/10 p-3">
              <p className="text-sm font-medium mb-2">Использовать промокод</p>
              <div className="flex gap-2">
                <input
                  value={promo}
                  onChange={(e) => {
                    setPromo(e.target.value.toUpperCase());
                    setPromoApplied(false);
                  }}
                  placeholder="Введите код"
                  className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm"
                />
                <button
                  onClick={() => setPromoApplied(promo.trim() === 'OISHI10')}
                  className="rounded-lg bg-[#EA580C] px-3 py-2 text-sm font-medium text-white"
                >
                  Применить
                </button>
              </div>
              <p className={`mt-2 text-xs ${promoApplied ? 'text-green-700' : 'text-black/50'}`}>{promoHint}</p>
            </div>

            <button className="w-full rounded-xl bg-[#EA580C] px-4 py-3 text-white font-semibold">
              Оформить заказ
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
