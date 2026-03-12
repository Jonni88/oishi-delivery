import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { isOpenNow } from '@/lib/time';
import ProductMenuClient from '@/components/product-menu-client';
import PromoSliderClient from '@/components/promo-slider-client';
import CartSidebarClient from '@/components/cart-sidebar-client';
import HeroAutoplayBanners from '@/components/hero-autoplay-banners';

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
        <header className="mb-3 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src="/logo/oishi-logo.jpg" alt="Oishi logo" className="h-12 w-12 rounded-xl object-cover ring-1 ring-black/10" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">Oishi</p>
                <h1 className="text-lg font-semibold leading-tight sm:text-xl">Доставка суши в Олекминске</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={`tel:${(settings?.phone ?? '+79245961740').replace(/\s/g, '')}`} className="hidden rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-black/80 hover:bg-black/[0.03] sm:inline-flex">
                {settings?.phone ?? '+79245961740'}
              </a>
              <a
                href={`https://wa.me/${(settings?.phone ?? '+79245961740').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 px-3 text-sm font-medium text-black/80 hover:bg-black/[0.03]"
                aria-label="WhatsApp"
              >
                WA
              </a>
              <a
                href="https://max.ru"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 px-3 text-sm font-medium text-black/80 hover:bg-black/[0.03]"
                aria-label="MAX"
              >
                MAX
              </a>
              <Link href="/checkout" className="rounded-xl bg-[#E10600] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                Корзина
              </Link>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black/55 sm:hidden">
            <a href={`tel:${(settings?.phone ?? '+79245961740').replace(/\s/g, '')}`} className="underline underline-offset-2">
              {settings?.phone ?? '+79245961740'}
            </a>
            <a href={`https://wa.me/${(settings?.phone ?? '+79245961740').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              Написать в WhatsApp
            </a>
            <a href="https://max.ru" target="_blank" rel="noreferrer" className="underline underline-offset-2">
              Написать в MAX
            </a>
          </div>
        </header>

        <HeroAutoplayBanners
          banners={promotions.slice(0, 4).map((p, i) => ({
            id: p.id,
            title: p.title,
            subtitle: p.description ?? 'Лучшие роллы и сеты с быстрой доставкой по Олекминску',
            cta: i === 0 ? 'Заказать роллы' : 'Смотреть меню',
          }))}
        />

        {(settings?.acceptOrders === false || settings?.statusMessage) && (
          <section className={`mb-4 rounded-2xl border px-4 py-3 ${settings?.acceptOrders === false ? 'border-red-200 bg-red-50 text-red-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
            <p className="text-sm font-semibold">
              {settings?.acceptOrders === false ? 'Сегодня заказы временно не принимаются' : 'Информация по режиму работы'}
            </p>
            {settings?.statusMessage && <p className="mt-1 text-sm">{settings.statusMessage}</p>}
          </section>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>

            <PromoSliderClient promos={promotions} />

            <section id="menu" className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">Меню</h3>
              <ProductMenuClient products={products} />
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <section className="rounded-2xl border border-black/5 bg-white p-4">
                <h3 className="text-lg font-semibold mb-2">Статус ресторана</h3>
                <p className={`inline-block rounded-full px-3 py-1 text-xs ${settings?.acceptOrders === false ? 'bg-red-100 text-red-700' : status.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {settings?.acceptOrders === false ? 'Заказы временно не принимаются' : status.open ? `Открыто до ${closing}` : `Закрыто до ${opening}`}
                </p>
                <p className="mt-2 text-sm text-black/60">{settings?.statusMessage ?? 'Быстрая доставка по городу'}</p>
              </section>

              <CartSidebarClient products={products} />
            </div>
          </aside>
        </div>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-20 w-[min(420px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-2 text-center text-xs text-black/60">
          <button className="text-[#E10600]">🏠<div>Главная</div></button>
          <button>🧾<div>Каталог</div></button>
          <button>🧺<div>Корзина</div></button>
          <button>👤<div>Профиль</div></button>
        </div>
      </nav>
    </main>
  );
}
