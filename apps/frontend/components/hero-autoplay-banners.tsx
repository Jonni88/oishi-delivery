'use client';

import { useEffect, useMemo, useState } from 'react';

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta?: string;
};

export default function HeroAutoplayBanners({ banners }: { banners: Banner[] }) {
  const safeBanners = useMemo(() => (banners.length ? banners : [{ id: 'default', title: 'Свежие роллы каждый день', subtitle: 'Доставка суши в Олекминске за 45–60 минут', cta: 'Выбрать роллы' }]), [banners]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [safeBanners.length]);

  return (
    <section className="relative left-1/2 right-1/2 mb-5 w-screen -translate-x-1/2 overflow-hidden bg-black text-white">
      <div className="relative h-[230px] sm:h-[280px]">
        {safeBanners.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background:
                'linear-gradient(120deg, rgba(0,0,0,0.82) 0%, rgba(225,6,0,0.72) 45%, rgba(0,0,0,0.65) 100%), url(/menu/menu-01.jpg) center/cover no-repeat',
            }}
          >
            <div className="mx-auto flex h-full w-full max-w-6xl items-end px-4 pb-8 lg:px-6">
              <div className="max-w-2xl">
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/80">Oishi</p>
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{b.title}</h2>
                <p className="mt-2 text-sm text-white/85 sm:text-base">{b.subtitle}</p>
                <a href="#menu" className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">
                  {b.cta ?? 'Заказать'}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {safeBanners.map((b, i) => (
          <button
            key={b.id}
            type="button"
            aria-label={`Баннер ${i + 1}`}
            className={`pointer-events-auto h-2.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2.5 bg-white/45'}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
