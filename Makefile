# Запускає контейнер
up:
	docker-compose up --build

# Зупиняє всі сервіси
down:
	docker-compose down

# Перезапускає з повною перебудовою
rebuild:
	docker-compose down -v
	docker-compose build --no-cache
	docker-compose up

# Встановлення пакета всередині контейнера: make install name=назва
install:
	docker-compose exec api npm install $(name)

# Встановлення dev-залежності: make install-dev name=назва
install-dev:
	docker-compose exec api npm install --save-dev $(name)

# Видалення пакету: make uninstall name=назва
uninstall:
	docker-compose exec api npm uninstall $(name)

# Доступ до shell всередині контейнера
sh:
	docker-compose exec api sh

# Запуск тестів (потрібно адаптувати до структури проєкту)
test:
	docker-compose exec api npm run test

# Лінтинг
lint:
	docker-compose exec api npm run lint

# Форматування з prettier
format:
	docker-compose exec api npm run format
