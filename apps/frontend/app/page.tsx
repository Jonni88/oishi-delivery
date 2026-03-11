import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { isOpenNow } from '@/lib/time';

export default async function HomePage() {
  const settings = await prisma.settings.findFirst();
  const opening = settings?.openingTime ?? '10:00';
  const closing = settings?.closingTime ?? '23:00';
  const status = isOpenNow(opening, closing);

  return (
    <main className="min-h-screen p-4 max-w-3xl mx-auto">
      <header className="flex items-center justify-between card p-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Oishi</h1>
          <p className="text-sm opacity-80">+79245961740</p>
        </div>
        <Link href="/checkout" className="btn-primary">Корзина</Link>
      </header>

      <section className="card p-4 mb-4">
        <p className="font-medium">
          {status.open ? `🟢 Открыто до ${closing}` : `🔴 Сейчас закрыто. Откроемся в ${opening}`}
        </p>
      </section>

      <section className="card p-4 mb-4">
        <div className="inline-flex bg-black/30 rounded-xl p-1">
          <button className="px-4 py-2 bg-accent rounded-lg">Доставка</button>
          <button className="px-4 py-2">Самовывоз</button>
        </div>
      </section>

      <section className="card p-6 mb-4">
        <h2 className="text-3xl font-bold mb-2">Суши и роллы Oishi</h2>
        <p className="opacity-80 mb-4">Свежие роллы каждый день</p>
        <a href="#menu" className="btn-primary inline-block">Смотреть меню</a>
      </section>

      <section id="menu" className="card p-6">
        <h3 className="text-xl font-semibold mb-2">Меню</h3>
        <p className="opacity-70">Меню скоро появится.</p>
      </section>
    </main>
  );
}
