FROM node:18.17-alpine3.18

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build