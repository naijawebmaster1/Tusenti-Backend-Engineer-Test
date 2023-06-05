dev:
	docker-compose up -d


dev-down:
	docker-compose down


dev-down-volume:
	docker-compose down


migrate:
	yarn rm -rf build && yarn build && yarn typeorm migration:generate ./src/migrations/added-active -d ./src/utils/data-source.ts
	

db-push:
	yarn build && yarn typeorm migrate:run


start:
	yarn ts-node-dev --respawn --transpile-only --exit-child src/app.ts


test:
    "test": "jest"
