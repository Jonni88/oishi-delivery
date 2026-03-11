'use client';

import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isPopular: boolean;
  isNew: boolean;
  isSpicy: boolean;
};

export default function ProductMenuClient({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {products.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => setSelected(item)}
          >
            <div className="relative">
              <img src={item.image ?? '/menu/menu-01.jpg'} alt={item.name} className="mb-2 h-28 w-full rounded-xl object-cover" />
              <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                {item.isPopular && <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">Хит</span>}
                {item.isNew && <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">Новинка</span>}
                {item.isSpicy && <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">Острый</span>}
              </div>
            </div>
            <p className="text-sm font-medium leading-tight min-h-[36px]">{item.name}</p>
            <p className="mt-1 text-xs text-black/60 line-clamp-2">{item.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-base font-semibold">{item.price} ₽</span>
              <button className="rounded-lg bg-[#ff5a1f] px-2 py-1 text-xs text-white">+ В корзину</button>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image ?? '/menu/menu-01.jpg'} alt={selected.name} className="h-64 w-full rounded-xl object-cover" />
            <h4 className="mt-3 text-xl font-semibold">{selected.name}</h4>
            <p className="mt-1 text-sm text-black/70">{selected.description ?? 'Состав уточняется'}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-2xl font-bold">{selected.price} ₽</span>
              <button className="rounded-xl bg-[#ff5a1f] px-4 py-2 text-sm font-medium text-white">Добавить в корзину</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
