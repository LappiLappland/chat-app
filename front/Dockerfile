FROM node:alpine

WORKDIR /usr/src/page

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npm run build-prod