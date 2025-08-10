FROM node:22.17.1

WORKDIR /auth-service/
COPY . .

COPY .env.example .env

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start" ]