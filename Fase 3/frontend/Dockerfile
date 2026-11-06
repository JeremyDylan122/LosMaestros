# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_USUARIOS_URL=/usuarios/api/v1
ARG VITE_API_VENTAS_URL=/ventas/api/v1
ENV VITE_API_USUARIOS_URL=$VITE_API_USUARIOS_URL
ENV VITE_API_VENTAS_URL=$VITE_API_VENTAS_URL
RUN npm run build

FROM nginx:stable-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/salud || exit 1
