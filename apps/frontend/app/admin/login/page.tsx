export default function AdminLoginPage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto flex items-center">
      <form className="card p-4 w-full space-y-3" method="post" action="/api/admin/auth/login">
        <h1 className="text-xl font-bold">Вход в админку</h1>
        <input name="login" className="w-full bg-black/30 rounded-lg p-3" placeholder="Логин" />
        <input name="password" type="password" className="w-full bg-black/30 rounded-lg p-3" placeholder="Пароль" />
        <button className="btn-primary w-full" type="submit">Войти</button>
      </form>
    </main>
  );
}
