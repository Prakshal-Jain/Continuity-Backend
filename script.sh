docker-compose stop
docker image prune -a -f
docker volume prune -f
docker system prune -f -a
mv ../.git .
git pull origin stable --no-ff
mv .git ..
docker-compose up -d
