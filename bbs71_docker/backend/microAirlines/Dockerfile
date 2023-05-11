FROM node:16

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY .env ./

RUN mkdir -p ./src
COPY ./src ./src

EXPOSE 3002

CMD ["node", "./src/index.js"]

