FROM node:22.17.1

WORKDIR /flox/web

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]