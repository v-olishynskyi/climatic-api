### === Development ===
dev-up:
	docker-compose -f docker-compose.yml up --build

dev-down:
	docker-compose -f docker-compose.yml down

dev-logs:
	docker-compose -f docker-compose.yml logs -f api

dev-sh:
	docker-compose -f docker-compose.yml exec api sh

### === Production ===
prod-up:
	docker-compose -f docker-compose.prod.yml up --build -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f api

prod-sh:
	docker-compose -f docker-compose.prod.yml exec api sh

### === Helpers ===
restart-dev:
	make dev-down && make dev-up

restart-prod:
	make prod-down && make prod-up
