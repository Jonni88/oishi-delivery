import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { isOpenNow } from '@/lib/time';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = await prisma.settings.findFirst();
  const promotions = await prisma.promotion.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 6 });
  const products = await prisma.product.findMany({ orderBy: [{ isPopular: 'desc' }, { createdAt: 'desc' }], take: 12 });

  const opening = settings?.openingTime ?? '10:00';
  const closing = settings?.closingTime ?? '23:00';
  const status = isOpenNow(opening, closing);

  return (
    <main className="min-h-screen pb-24 lg:pb-8">
      <div className="mx-auto max-w-6xl px-4 pt-4 lg:px-6">
        <header className="mb-4 flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-black/5">
          <div className="flex items-center gap-3">
            <img src="/logo/oishi-logo.jpg" alt="Oishi logo" className="h-12 w-12 rounded-xl object-cover" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">Oishi Delivery</p>
              <h1 className="text-3xl font-semibold leading-none mt-1">Oishi</h1>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary text-sm font-medium">Корзина</Link>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <section className="mb-3 rounded-2xl border border-black/5 bg-white p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">+79245961740</span>
                <span className={`rounded-full px-2 py-1 text-xs ${status.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {status.open ? `🟢 Открыто до ${closing}` : `🔴 Закрыто до ${opening}`}
                </span>
              </div>
              <div className="inline-flex rounded-xl bg-black/5 p-1 text-sm">
                <button className="rounded-lg bg-[#ff5a1f] px-4 py-2 text-white">Доставка</button>
                <button className="px-4 py-2 text-black/60">Самовывоз</button>
              </div>
            </section>

            <section className="mb-4 rounded-2xl border border-black/5 bg-white p-5">
              <p className="mb-1 text-xs uppercase tracking-wider text-[#ff5a1f]">Свежие роллы каждый день</p>
              <h2 className="text-3xl font-semibold leading-tight">Суши и роллы Oishi</h2>
              <p className="mt-2 text-sm text-black/60">От «хочу есть» до «оплачено» — самым коротким и вкусным путем.</p>
              <a href="#menu" className="mt-3 inline-block rounded-xl bg-[#ff5a1f] px-4 py-2 text-sm font-medium text-white">Заказать вкусно</a>
            </section>

            <section className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Акции</h3>
                <span className="rounded-lg bg-orange-100 px-2 py-1 text-xs text-[#ff5a1f]">Hot</span>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {promotions.map((promo) => (
                  <article key={promo.id} className="rounded-2xl border border-black/5 bg-white p-3">
                    <p className="text-xs text-[#ff5a1f]">{promo.badge ?? 'Спецпредложение'}</p>
                    <h4 className="mt-1 text-sm font-semibold leading-snug">{promo.title}{promo.discount ? ` −${promo.discount}%` : ''}</h4>
                    <p className="mt-1 text-xs text-black/60">{promo.description ?? (promo.promoCode ? `Промокод: ${promo.promoCode}` : 'Подробности внутри акции')}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="menu" className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">Меню</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {products.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm hover:shadow-md transition">
                    <img src={item.image ?? '/menu/menu-01.jpg'} alt={item.name} className="mb-2 h-28 w-full rounded-xl object-cover" />
                    <p className="text-sm font-medium leading-tight min-h-[36px]">{item.name}</p>
                    <p className="mt-1 text-xs text-black/60 line-clamp-2">{item.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-base font-semibold">{item.price} ₽</span>
                      <button className="rounded-lg bg-[#ff5a1f] px-2 py-1 text-xs text-white">+ В корзину</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <section className="rounded-2xl border border-black/5 bg-white p-4">
                <h3 className="text-lg font-semibold mb-2">Статус ресторана</h3>
                <p className={`inline-block rounded-full px-3 py-1 text-xs ${status.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {status.open ? `Открыто до ${closing}` : `Закрыто до ${opening}`}
                </p>
                <p className="mt-2 text-sm text-black/60">Быстрая доставка по городу</p>
              </section>

              <section className="rounded-2xl border border-black/5 bg-white p-4">
                <h3 className="text-lg font-semibold mb-2">Корзина</h3>
                <p className="text-sm text-black/60 mb-3">Добавь товары и оформи за 30–40 секунд.</p>
                <Link href="/checkout" className="inline-block w-full rounded-xl bg-[#ff5a1f] px-4 py-3 text-center text-sm font-medium text-white">
                  Перейти к оформлению
                </Link>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-20 w-[min(420px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-2 text-center text-xs text-black/60">
          <button className="text-[#ff5a1f]">🏠<div>Главная</div></button>
          <button>🧾<div>Каталог</div></button>
          <button>🧺<div>Корзина</div></button>
          <button>👤<div>Профиль</div></button>
        </div>
      </nav>
    </main>
  );
}
