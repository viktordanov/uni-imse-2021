production-build:
	sudo docker-compose -f docker-compose.production.yml build
	echo 'y' | sudo docker image prune
	echo 'y' | sudo ./init-letsencrypt.sh

production-serve:
	sudo docker-compose -f docker-compose.production.yml up

development-build:
	sudo docker-compose -f docker-compose.yml build
	yes | sudo docker image prune

development-serve:
	sudo docker-compose -f docker-compose.yml up

