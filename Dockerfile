# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

RUN touch /var/run/nginx.pid && \
    mkdir -p /var/cache/nginx && \
    chmod g+rwx /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid && \
    chgrp -R root /var/cache/nginx && \
    addgroup nginx root

EXPOSE 8080

USER nginx

CMD ["nginx"]