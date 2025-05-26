FROM node:20-alpine3.21

ENV NODE_ENV=development

WORKDIR /var/www/application

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD npm run migration:run && npm run start:dev
