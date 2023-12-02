FROM node

WORKDIR /usr/src/app

ARG UV_USE_IO_URING=0

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npm run build-prod

CMD ["npm", "run", "start-prod"]