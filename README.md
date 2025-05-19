🧾 README: Запуск Climatic API

Цей проєкт — NestJS API сервіс для підписки на прогноз погоди з відправкою листів на email. Дані зберігаються в PostgreSQL. Підтримується запуск як у dev, так і у production режимі через Docker.

📦 Вимоги

Docker (v20+)
Docker Compose (v2+)
Встановлена SSH-ключ або доступ до репозиторію
📁 Структура проєкту (спрощено)

├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── .env
├── .env.prod
├── src/
└── ...
🚀 Швидкий старт (режим розробки)

git clone https://github.com/your-org/climatic-api.git
cd climatic-api
cp .env.example .env
make dev-up
API буде доступне на: http://localhost:3000

⚙️ Запуск у production режимі

cp .env.prod.example .env.prod
make prod-up
Після цього:

API буде доступне на порту 3000
База даних працює на порту 5432
📄 Корисні Make-команди

Команда Опис
make dev-up Запуск у dev режимі (start:dev)
make dev-logs Перегляд логів dev-контейнера
make prod-up Збірка та запуск продакшн-версії
make prod-logs Перегляд логів продакшн
make dev-sh Вхід у dev-контейнер через shell
make prod-sh Вхід у prod-контейнер через shell
make prod-clean Зупинка і очищення всіх прод сервісів
🛠 Налаштування .env

📌 Змінні в env важливі для підключення до бази, пошти, JWT тощо.
📁 .env (для dev)
POSTGRES_DB=climatic
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

JWT_SECRET=dev_secret
JWT_EXPIRES_IN=1h

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_user
MAIL_PASSWORD=your_pass
MAIL_FROM=no-reply@climatic.dev
🧪 Перевірка

Після запуску відкрий у браузері Swagger-документацію:

👉 http://localhost:3000/api

🧼 Очищення

make dev-clean
make prod-clean
📬 Звʼязок

Для питань та пропозицій — звертайся до основного розробника або через GitHub Issues.
