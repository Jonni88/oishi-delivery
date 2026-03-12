'use client';

import { useEffect, useState } from 'react';

type SettingsState = {
  phone: string;
  address: string;
  openingTime: string;
  closingTime: string;
  deliveryMinAmount: number;
  deliveryPrice: number;
  pickupTimeMinutes: number;
  acceptOrders: boolean;
  statusMessage: string;
};

const initialState: SettingsState = {
  phone: '+79245961740',
  address: '',
  openingTime: '10:00',
  closingTime: '23:00',
  deliveryMinAmount: 0,
  deliveryPrice: 0,
  pickupTimeMinutes: 25,
  acceptOrders: true,
  statusMessage: ''
};

export default function AdminStatusSettingsForm() {
  const [form, setForm] = useState<SettingsState>(initialState);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setForm({
          phone: data.phone ?? initialState.phone,
          address: data.address ?? '',
          openingTime: data.openingTime ?? initialState.openingTime,
          closingTime: data.closingTime ?? initialState.closingTime,
          deliveryMinAmount: data.deliveryMinAmount ?? 0,
          deliveryPrice: data.deliveryPrice ?? 0,
          pickupTimeMinutes: data.pickupTimeMinutes ?? 25,
          acceptOrders: data.acceptOrders ?? true,
          statusMessage: data.statusMessage ?? ''
        });
      })
      .catch(() => setMsg('Не удалось загрузить настройки'));
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        address: form.address || null,
        statusMessage: form.statusMessage || null
      })
    });

    setSaving(false);
    setMsg(res.ok ? 'Сохранено' : 'Ошибка сохранения');
  };

  return (
    <section className="card p-4 mt-4 space-y-3">
      <h2 className="text-xl font-semibold">Статус ресторана (главная)</h2>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.acceptOrders}
          onChange={(e) => setForm((s) => ({ ...s, acceptOrders: e.target.checked }))}
        />
        Принимать заказы
      </label>

      <div>
        <p className="mb-1 text-sm text-black/70">Сообщение для клиентов</p>
        <textarea
          value={form.statusMessage}
          onChange={(e) => setForm((s) => ({ ...s, statusMessage: e.target.value }))}
          placeholder="Например: Сегодня заказы не принимаем. В праздничные дни работаем до 20:00"
          className="w-full rounded-lg border border-black/15 p-3 text-sm"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-sm">Открытие
          <input
            type="time"
            value={form.openingTime}
            onChange={(e) => setForm((s) => ({ ...s, openingTime: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-black/15 p-2"
          />
        </label>
        <label className="text-sm">Закрытие
          <input
            type="time"
            value={form.closingTime}
            onChange={(e) => setForm((s) => ({ ...s, closingTime: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-black/15 p-2"
          />
        </label>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-xl bg-[#E10600] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? 'Сохраняю...' : 'Сохранить настройки'}
      </button>

      {msg && <p className="text-sm text-black/70">{msg}</p>}
    </section>
  );
}
