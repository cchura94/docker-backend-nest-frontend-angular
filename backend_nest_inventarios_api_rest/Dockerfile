FROM node:22-alpine3.22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# RUN npm run migration:run

CMD [ "node", "dist/src/main.js" ]