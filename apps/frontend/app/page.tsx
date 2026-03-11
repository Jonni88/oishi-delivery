import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { isOpenNow } from '@/lib/time';

export const dynamic = 'force-dynamic';

const featuredPlaceholders = [
  { id: 'f1', name: 'Филадельфия классик', price: 329 },
  { id: 'f2', name: 'Калифорния с креветкой', price: 349 },
  { id: 'f3', name: 'Острый лосось', price: 299 },
  { id: 'f4', name: 'Запечённый сет', price: 499 }
];

export default async function HomePage() {
  const settings = await prisma.settings.findFirst();
  const promotions = await prisma.promotion.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 6 });

  const opening = settings?.openingTime ?? '10:00';
  const closing = settings?.closingTime ?? '23:00';
  const status = isOpenNow(opening, closing);

  const promoView: Array<{ id: string; title: string; description: string | null; badge: string | null; promoCode: string | null; discount: number | null }> =
    promotions.length
      ? promotions.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          badge: p.badge,
          promoCode: p.promoCode,
          discount: p.discount
        }))
      : [
          { id: 'demo-1', title: 'Сет дня', description: 'Скидка 20% от 2000 ₽', badge: 'Только сегодня', promoCode: null, discount: 20 },
          { id: 'demo-2', title: 'Промокод OISHI10', description: 'Скидка на первый заказ', badge: 'Промокод', promoCode: 'OISHI10', discount: 10 }
        ];

  return (
    <main className="min-h-screen bg-bg text-text pb-28">
      <div className="mx-auto max-w-md px-4 pt-4">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-60">Oishi Delivery</p>
            <h1 className="text-3xl font-semibold leading-none mt-1">Oishi</h1>
          </div>
          <Link href="/checkout" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/30">
            Корзина
          </Link>
        </header>

        <section className="mb-3 rounded-2xl border border-white/10 bg-card p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">+79245961740</span>
            <span className={`rounded-full px-2 py-1 text-xs ${status.open ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {status.open ? `🟢 Открыто до ${closing}` : `🔴 Закрыто до ${opening}`}
            </span>
          </div>
          <div className="inline-flex rounded-xl bg-black/40 p-1 text-sm">
            <button className="rounded-lg bg-accent px-4 py-2 text-white">Доставка</button>
            <button className="px-4 py-2 text-white/70">Самовывоз</button>
          </div>
        </section>

        <section className="mb-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1f2430] to-[#111318] p-4">
          <p className="mb-1 text-xs uppercase tracking-wider text-accent">Суши и роллы Oishi</p>
          <h2 className="text-2xl font-semibold leading-tight">Свежие роллы каждый день</h2>
          <p className="mt-2 text-sm text-white/65">Оформляй заказ за 30–40 секунд</p>
          <a href="#menu" className="mt-3 inline-block rounded-xl bg-accent px-4 py-2 text-sm font-medium">Смотреть меню</a>
        </section>

        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Акции</h3>
            <span className="rounded-lg bg-accent/20 px-2 py-1 text-xs text-accent">Hot</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {promoView.map((promo) => (
              <article key={promo.id} className="rounded-2xl border border-white/10 bg-card p-3">
                <p className="text-xs text-accent">{promo.badge ?? 'Спецпредложение'}</p>
                <h4 className="mt-1 text-sm font-semibold leading-snug">{promo.title}{promo.discount ? ` −${promo.discount}%` : ''}</h4>
                <p className="mt-1 text-xs text-white/60">{promo.description ?? (promo.promoCode ? `Промокод: ${promo.promoCode}` : 'Подробности внутри акции')}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Популярное</h3>
          <div className="grid grid-cols-2 gap-3">
            {featuredPlaceholders.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-card p-3">
                <div className="mb-2 h-20 rounded-xl bg-gradient-to-br from-white/10 to-white/5" />
                <p className="text-sm font-medium leading-tight">{item.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">{item.price} ₽</span>
                  <button className="rounded-lg bg-accent px-2 py-1 text-xs">+</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="menu" className="rounded-2xl border border-white/10 bg-card p-4">
          <h3 className="text-lg font-semibold mb-1">Меню</h3>
          <p className="text-sm text-white/70">Меню скоро появится.</p>
        </section>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-20 w-[min(420px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#12151d]/95 px-4 py-3 backdrop-blur">
        <div className="grid grid-cols-4 gap-2 text-center text-xs text-white/70">
          <button className="text-accent">🏠<div>Главная</div></button>
          <button>🧾<div>Каталог</div></button>
          <button>🧺<div>Корзина</div></button>
          <button>👤<div>Профиль</div></button>
        </div>
      </nav>
    </main>
  );
}
