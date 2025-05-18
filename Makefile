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

# ---------- Variables ----------
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yml
DOCKER_COMPOSE_STAGE = docker-compose -f docker-compose.stage.yml
APP_NAME = climatic_api_prod

# ---------- Production ----------
prod-up:
	$(DOCKER_COMPOSE_PROD) up -d --build

stage-up:
	$(DOCKER_COMPOSE_STAGE) up -d --build

prod-down:
	$(DOCKER_COMPOSE_PROD) down

prod-restart:
	$(DOCKER_COMPOSE_PROD) restart

prod-logs:
	$(DOCKER_COMPOSE_PROD) logs -f $(APP_NAME)

prod-sh:
	$(DOCKER_COMPOSE_PROD) exec $(APP_NAME) sh

prod-clean:
	$(DOCKER_COMPOSE_PROD) down -v --remove-orphans

prod-rebuild:
	$(DOCKER_COMPOSE_PROD) build --no-cache