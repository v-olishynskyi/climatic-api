# 🌦️ Climatic API

**Climatic** — REST API сервіс для підписки на погодні оновлення на email. Користувач обирає місто та частоту (щогодинно/щоденно) оновлень.

---

## 📌 Основні можливості

- Створення підписки з частотою (щоденно/щогодинно)
- Підтвердження підписки через email
- Розсилка листів через BullMQ + Redis
- Кешування погодних даних (WeatherAPI)
- Документація Swagger
- Підтримка міграцій (TypeORM)
- Docker

---

API URL: https://climatic-api.onrender.com

---

Логіка роботи апі

1. Користувач робить запит на ендпойнт /subscribe передаючи туди email (на який будуть надходити листи), city (місто для погоди) та frequency (частота сповіщень з погодою)
2. subscription.controller.ts обробляє цей запит та у subscription.service.ts виконує наступну логіку

- перевірити чи місто введено правильно (зробивши запит на Weather API)
- створити та записати в базу дані цієї підписки (email, city, frequency та subscription_token який буде використовуватись для підтвердження підписки або відписки)
- додати в чергу bullMQ job який відправить лист на пошту

3. користувач переходить в лист та натискає підтвердження підписки
4. subscription.controller.ts обробляє цей запит та у subscription.service.ts виконує наступну логіку

- перевірити чи існує в базі така підписка
- якщо не існує - повернути 404
- якщо існує - змінити поле `subscribed: true`

5. щогодини та щодня о 07:00 запускається cron job який виконує наступну логіку (weather-scheduler.service.ts)

- витягнути з бази всіх користувачів з `subscribed: true` та відповідним (щогодини/щодня) frequency
- сформувати список унікальних міст для яких потрібна погода
- по списку міст зробити запит на Weather API для отримання погоди (всі запити кешуються у Redis з TTL=60 \* 60; // 1 hour)
- пройтись по всьому списку підписок та на додати всі відправки лістів у чергу (окремі черги для hourly та dayli)

6. користувач переходить в лист з оновленням погоди та натискає Відписатись
7. subscription.controller.ts обробляє цей запит та у subscription.service.ts виконує наступну логіку

- перевірити чи існує в базі така підписка
- якщо не існує - повернути 404
- якщо існує - змінити поле `subscribed: false` та `unsubscribed_at: new Date()`

---

## ⚙️ Технології

- **NestJS** — Node.js framework
- **PostgreSQL** — база даних
- **TypeORM** — ORM + міграції
- **Redis** — кеш і черги
- **BullMQ** — керування асинхронними задачами
- **@nestjs-modules/mailer** + **nodemailer** — відправка email
- **Swagger** — OpenAPI документація

---

## 🚀 Швидкий старт

## 🔐 Налаштувати .env змінні (dev)

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=climatic

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

WEATHER_API_KEY=your_weatherapi_key
WEATHER_API_URL=https://api.weatherapi.com

MAIL_HOST=your_mail_host
MAIL_PORT=587
MAIL_PASSWORD=your_mail_password
MAIL_FROM=Climatic <your@mail.com>

JWT_SECRET=supersecretstring

BASE_URL=http://localhost:3000

```

### 🔧 Запуск через Docker

```bash
git clone https://github.com/v-olishynskyi/climatic-api
cd climatic-api

make dev-up     # Запуск в режимі dev
docker ps       # перевірка статусу
```

### 📂 Доступні сервіси

- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)
- Redis: localhost:6379
- PostgreSQL: localhost:5432

---

## 📧 API Ендпоїнти

| Method | Endpoint              | Description                |
| ------ | --------------------- | -------------------------- |
| POST   | `/weather`            | Отримання даних про погоду |
| POST   | `/subscribe`          | Створення підписки         |
| GET    | `/confirm/:token`     | Підтвердження email        |
| GET    | `/unsubscribe/:token` | Відмова від оновлень       |
| GET    | `/docs`               | Swagger документація       |

---

---

## 📆 Makefile команди

```makefile
make dev-up          # Запуск docker-compose.dev.yml
make dev-down        # Стоп docker
make prod-up         # Запуск docker-compose.prod.yml
make dev-down        # Стоп docker
make logs            # Поточні логи API
```

## 📁 Структура

Проєкт організований відповідно до принципів **SOLID**, **Clean Architecture**, та **Modular Architecture** NestJS.

```
src/
│
├── config/ # Конфігураційні файли для сервісів
│ ├── config.module.ts # Глобальний конфіг модуль
│ ├── shared-config.service.ts# Обгортка для доступу до змінних конфігурації
│ ├── *.config.ts # Тематичні конфіги: redis, jwt, mail, db
│
├── infrastructure/ # Інфраструктурні сервіси (пошта, база, шедулери)
│ ├── database/
│ │ ├── migrations/ # Файли міграцій
│ │ ├── database.module.ts # Підключення до бази через TypeORM
│ │ └── typeorm.config.ts # Конфіг для cli-міграцій
│ │
│ ├── mail/ # Відправка пошти
│ │ ├── dto/ # DTO для мейлінгу
│ │ ├── factory/ # Шаблони листів через MailFactory
│ │ ├── services/ # mail.service.ts
│ │ ├── templates/ # Handlebars шаблони листів
│ │ └── mail.module.ts
│ │
│ ├── schedulers/ # Крон-джоби
│ │ ├── services/ # Крон сервіси
│ │ └── scheduler.module.ts
│
├── weather/ # Модуль роботи з weather API
│ ├── controllers/
│ ├── dto/
│ ├── services/ # WeatherService + WeatherCacheService
│ └── weather.module.ts
│
├── modules/subscription/ # Модуль підписок
│ ├── controllers/
│ ├── dto/
│ ├── entities/ # subscription.entity.ts
│ ├── enum/
│ ├── factory/
│ ├── services/
│ └── subscription.module.ts
│
├── queues/ # Робота з BullMQ чергами
│ ├── mail-confirmation/
│ │ ├── *.queue.module.ts # Черга для листа підтвердження
│ │ ├── .queue.processor.ts
│ │ └── .queue.service.ts
│ │
│ ├── mail-weather/
│ │ ├── weather-daily.queue.
│ │ ├── weather-hourly.queue.
│ │ ├── weather-queue-dispatcher.service.ts # Делегування задач по оновленнях
│ │ └── weather-queue.types.ts
│ │
│ ├── constants.ts
│ └── queues.module.ts
│
├── redis/ # IORedis підключення
│ ├── constants.ts
│ └── redis.module.ts
│
├── shared/ # Допоміжні сервіси та утиліти
│ ├── helpers/ # Наприклад url.helper.ts
│ └── jwt/ # JWT-сервіс для підписки/відписки
│
├── main.ts # Точка входу
├── app.module.ts # Кореневий модуль
└── swagger.ts # Swagger конфігурація
```

### Інші файли:

- `.env`, `.env.prod` — змінні середовища для дев/прод
- `Makefile` — корисні команди для запуску (наприклад, `make dev-up`, `make prod-up`, `make migrate`)
- `docker-compose.yml`, `docker-compose.prod.yml` — Docker конфігурації для dev і prod
- `Dockerfile`, `Dockerfile_prod` — відповідно девелоперський та продакшн білд

---

## 👨‍💼 Автор

**Владислав Олішинський**
[GitHub: @v-olishynskyi](https://github.com/v-olishynskyi)

---
