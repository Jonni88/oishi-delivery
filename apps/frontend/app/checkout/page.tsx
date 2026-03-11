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

        <div className="rounded-lg border border-white/10 p-3">
          <p className="text-sm mb-2 text-white/80">Когда приготовить?</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="rounded-lg bg-black/30 p-2 text-sm">
              <input type="radio" name="when" defaultChecked className="mr-2" />
              Как можно быстрее
            </label>
            <label className="rounded-lg bg-black/30 p-2 text-sm">
              <input type="radio" name="when" className="mr-2" />
              Ко времени
            </label>
          </div>
          <input type="datetime-local" className="w-full mt-2 bg-black/30 rounded-lg p-3" />
          <p className="text-xs text-white/60 mt-2">Если ресторан закрыт — выбери ближайший доступный слот.</p>
        </div>

        <input className="w-full bg-black/30 rounded-lg p-3" placeholder="Адрес (для доставки)" />

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
