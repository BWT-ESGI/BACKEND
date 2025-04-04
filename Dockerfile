# Base image
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.example ./.env

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]