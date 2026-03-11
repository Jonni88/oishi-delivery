'use client';

import { useRef } from 'react';

type Promo = {
  id: string;
  title: string;
  description: string | null;
  badge: string | null;
  promoCode: string | null;
  discount: number | null;
};

export default function PromoSliderClient({ promos }: { promos: Promo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Акции</h3>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard('left')}
            className="h-8 w-8 rounded-full border border-black/10 bg-white text-sm"
            aria-label="Предыдущая акция"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByCard('right')}
            className="h-8 w-8 rounded-full border border-black/10 bg-white text-sm"
            aria-label="Следующая акция"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {promos.map((promo) => (
          <article
            key={promo.id}
            className="min-w-[85%] sm:min-w-[360px] snap-start rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 inline-flex rounded-lg bg-orange-100 px-2 py-1 text-xs font-medium text-[#EA580C]">
              {promo.badge ?? 'Спецпредложение'}
            </div>
            <h4 className="text-base font-semibold leading-tight">
              {promo.title}
              {promo.discount ? ` −${promo.discount}%` : ''}
            </h4>
            <p className="mt-1 text-sm text-black/60">
              {promo.description ?? (promo.promoCode ? `Промокод: ${promo.promoCode}` : 'Подробности внутри акции')}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
