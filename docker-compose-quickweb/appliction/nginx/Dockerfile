#FROM node:16.13-buster-slim as build-app
FROM node:16.13.0-alpine as build-app
LABEL org.opencontainers.image.authors="seth"

WORKDIR /app

ADD app/package.json ./
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

ADD app ./

RUN npm run build

FROM registry.cn-beijing.aliyuncs.com/qiangxianfei/alpine_nginx:v1.2
RUN mkdir /app
COPY --from=build-app /app/dist /app
