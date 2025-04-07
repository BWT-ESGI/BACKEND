# Base image
FROM arm64v8/node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.example ./.env

RUN npm install --build-from-source

EXPOSE 3000

CMD ["npm", "run", "start:prod"]