export default function CheckoutPage() {
  return (
    <main className="min-h-screen p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Оформление заказа</h1>
      <div className="card p-4 space-y-3">
        <input className="w-full bg-black/30 rounded-lg p-3" placeholder="Имя" />
        <input className="w-full bg-black/30 rounded-lg p-3" placeholder="Телефон" />
        <select className="w-full bg-black/30 rounded-lg p-3">
          <option>Доставка</option>
          <option>Самовывоз</option>
        </select>
        <input className="w-full bg-black/30 rounded-lg p-3" placeholder="Адрес" />
        <select className="w-full bg-black/30 rounded-lg p-3">
          <option>Наличные</option>
          <option>Перевод</option>
          <option>Терминал</option>
        </select>
        <button className="btn-primary w-full opacity-50 cursor-not-allowed" disabled>
          Оформление недоступно: меню пока пустое
        </button>
      </div>
    </main>
  );
}
