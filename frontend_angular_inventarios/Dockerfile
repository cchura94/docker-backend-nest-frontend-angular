FROM node:22-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build-stage /usr/src/app/dist/frontend_angular_inventarios/browser /usr/share/nginx/html

EXPOSE 80