'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  isPopular: boolean;
  isNew: boolean;
  isSpicy: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const load = async () => {
    const res = await fetch('/api/admin/products', { cache: 'no-store' });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const saveFlags = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPopular: p.isPopular, isNew: p.isNew, isSpicy: p.isSpicy })
    });
  };

  return (
    <main className="min-h-screen p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Админка / Товары / Бейджи</h1>
      <div className="overflow-x-auto card p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/10">
              <th className="p-2">Название</th>
              <th className="p-2">Цена</th>
              <th className="p-2">Хит</th>
              <th className="p-2">Новинка</th>
              <th className="p-2">Острый</th>
              <th className="p-2">Действие</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} className="border-b border-black/5">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.price} ₽</td>
                <td className="p-2"><input type="checkbox" checked={p.isPopular} onChange={(e) => {
                  const next = [...products];
                  next[i] = { ...p, isPopular: e.target.checked };
                  setProducts(next);
                }} /></td>
                <td className="p-2"><input type="checkbox" checked={p.isNew} onChange={(e) => {
                  const next = [...products];
                  next[i] = { ...p, isNew: e.target.checked };
                  setProducts(next);
                }} /></td>
                <td className="p-2"><input type="checkbox" checked={p.isSpicy} onChange={(e) => {
                  const next = [...products];
                  next[i] = { ...p, isSpicy: e.target.checked };
                  setProducts(next);
                }} /></td>
                <td className="p-2">
                  <button className="btn-primary text-xs" onClick={() => saveFlags(p)}>Сохранить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
