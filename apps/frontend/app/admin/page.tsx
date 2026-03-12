import { prisma } from '@/lib/prisma';
import AdminStatusSettingsForm from '@/components/admin-status-settings-form';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [ordersCount, newOrders, sum, promotionsCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'новый' } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.promotion.count({ where: { isActive: true } })
  ]);

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin / Dashboard</h1>
        <div className="flex items-center gap-2">
          <a href="/admin/products" className="btn-primary">Бейджи товаров</a>
          <form method="post" action="/api/admin/auth/logout">
            <button className="btn-primary" type="submit">Выйти</button>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">Всего заказов: {ordersCount}</div>
        <div className="card p-4">Новые заказы: {newOrders}</div>
        <div className="card p-4">Сумма заказов: {sum._sum.total ?? 0} ₽</div>
        <div className="card p-4">Активные акции: {promotionsCount}</div>
      </div>

      <AdminStatusSettingsForm />
    </main>
  );
}
