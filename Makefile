production-build:
	sudo docker-compose -f docker-compose.production.yml build

production-serve:
	sudo docker-compose -f docker-compose.production.yml up

development-build:
	sudo docker-compose -f docker-compose.yml build

development-serve:
	sudo docker-compose -f docker-compose.yml up

