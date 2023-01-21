docker-compose stop
docker-compose down
mv ../.git .
docker image prune -a -f
docker volume prune -f
docker system prune -f -a
mv .git ..
docker-compose up -d
