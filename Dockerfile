FROM ubuntu:18.04

ENV HOME /root
WORKDIR /root

COPY . .

RUN apt-get update && \
  apt-get install -y  curl && \
  curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install -y nodejs

RUN set -xe \
    && apt-get update \
    && apt-get install python3-pip

RUN pip install -r requirements.txt

EXPOSE 80

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && python -u backend/server.py

WORKDIR /app

RUN npm install && npm install -g expo-cli
CMD [ "npm", "start" ]