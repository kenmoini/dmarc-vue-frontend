# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn global add @vue/cli
RUN yarn install
RUN vue-cli-service build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]