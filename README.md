# PC Compare

Вебзастосунок для порівняння комплектуючих і збирання ПК (лабораторні роботи № 1–5).

- **Клієнт:** HTML, CSS, JavaScript (папки `css/`, `js/`, файли `*.html`).
- **Сервер:** Node.js + Express, REST API (`server/`).
- **База даних:** SQLite (вбудований модуль `node:sqlite`, потрібен Node.js 22.5 або новіший).

## Запуск

```bash
cd server
npm install
npm start
```

Сайт відкривається на http://localhost:3000 (сервер роздає і клієнтську частину, і API).

## Тести

```bash
cd server
npm test
```

## REST API

| Метод | Маршрут | Опис |
|---|---|---|
| GET | `/api/health` | перевірка роботи сервера |
| GET | `/api/products?category=&socket=&maxPrice=` | каталог компонентів |
| GET | `/api/builds?public=1` | список збірок (усі або лише публічні) |
| GET | `/api/builds/:id` | одна збірка |
| POST | `/api/builds` | створити збірку `{ name, parts, is_public? }` |
| PUT | `/api/builds/:id` | оновити збірку (можна передати лише змінені поля) |
| DELETE | `/api/builds/:id` | видалити збірку |

## Змінні середовища

`PORT` (за замовчуванням 3000), `DB_FILE` (шлях до файлу SQLite), `CORS_ORIGIN` (лише якщо клієнт на іншому домені). Секрети в репозиторій не додаються.
