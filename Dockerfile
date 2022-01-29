FROM node:16.13.1

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

EXPOSE 8080/tcp

CMD yarn start
