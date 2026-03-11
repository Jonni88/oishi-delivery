# Oishi Delivery

## Запуск
```bash
cd oishi-delivery
docker compose up -d
```

После запуска открой:
- сайт: http://localhost:3000
- админка: http://localhost:3000/admin
- health: http://localhost:3000/api/health

## Важно
- Каталог сейчас пустой (по ТЗ)
- Checkout отключен, пока нет товаров

## Prisma
Модели находятся в:
- `/prisma/schema.prisma`
- `/apps/frontend/prisma/schema.prisma`

## Что дальше
1. Добавить auth для `/admin`
2. Добавить полноценные CRUD API для admin
3. Подключить PWA manifest + icons
4. Добавить тесты (unit + e2e)
