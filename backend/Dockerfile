FROM node:18.17-alpine3.18

RUN apk update
RUN apk add tzdata

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build