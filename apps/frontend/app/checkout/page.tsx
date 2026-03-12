'use client';

import { useMemo, useState } from 'react';
import { useCartStore } from '@/lib/cart-store';

type DeliveryType = 'delivery' | 'pickup';
type PaymentType = 'cash' | 'transfer' | 'terminal';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('cash');

  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState<string>('');

  const subtotal = getTotalPrice();
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount);

  const promoHint = useMemo(() => {
    if (!promo) return 'Введите промокод, например OISHI10';
    if (promoApplied) return 'Промокод применён: скидка 10%';
    return 'Промокод не применён';
  }, [promo, promoApplied]);

  const submitOrder = async () => {
    if (!customerName.trim() || !phone.trim()) {
      setResultMsg('Заполни имя и телефон');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setResultMsg('Укажи адрес доставки');
      return;
    }

    setSubmitting(true);
    setResultMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          deliveryType,
          address: deliveryType === 'delivery' ? address : null,
          comment: comment || null,
          paymentType,
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity }))
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResultMsg(data?.message ?? 'Не удалось оформить заказ');
        return;
      }

      clearCart();
      setResultMsg('Заказ успешно оформлен ✅');
    } catch {
      setResultMsg('Ошибка сети. Попробуй ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Корзина и оформление</h1>

      {items.length === 0 ? (
        <div className="card p-6 text-center text-black/60">Корзина пустая</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
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
            <h2 className="text-lg font-semibold">Оформление</h2>

            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Имя"
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон"
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeliveryType('delivery')}
                className={`rounded-lg px-3 py-2 text-sm ${deliveryType === 'delivery' ? 'bg-[#E10600] text-white' : 'border border-black/15'}`}
              >
                Доставка
              </button>
              <button
                onClick={() => setDeliveryType('pickup')}
                className={`rounded-lg px-3 py-2 text-sm ${deliveryType === 'pickup' ? 'bg-[#E10600] text-white' : 'border border-black/15'}`}
              >
                Самовывоз
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Адрес доставки"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
              />
            )}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий к заказу"
              rows={2}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />

            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as PaymentType)}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            >
              <option value="cash">Наличные</option>
              <option value="transfer">Перевод</option>
              <option value="terminal">Терминал</option>
            </select>

            <div className="space-y-1 text-sm border-t border-black/10 pt-2">
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

            <button
              onClick={submitOrder}
              disabled={submitting}
              className="w-full rounded-xl bg-[#EA580C] px-4 py-3 text-white font-semibold disabled:opacity-60"
            >
              {submitting ? 'Оформляем...' : 'Оформить заказ'}
            </button>

            {resultMsg && <p className="text-sm text-black/70">{resultMsg}</p>}
          </aside>
        </div>
      )}
    </main>
  );
}
