# Use a imagem oficial do Node.js
FROM node:latest

#
# DataDog Tracer
# Requisitado pela equipe Infra
#
ARG DD_ENV="development"
ENV DD_ENV="${DD_ENV}"

ARG DD_SERVICE=service
ENV DD_SERVICE="${DD_SERVICE}"

ARG DD_VERSION=0.1.3
ENV DD_VERSION="${DD_VERSION}"

ARG DD_AGENT_HOST=localhost
ENV DD_AGENT_HOST="${DD_AGENT_HOST}"

ARG DD_LOGS_INJECTION=true
ENV DD_LOGS_INJECTION="${DD_LOGS_INJECTION}"

WORKDIR /usr/src/app
COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "prod"]