FROM node:14

COPY [".", "/usr/src/"]

WORKDIR /usr/src/

RUN rm -rf node_modules

RUN yarn

RUN yarn build

EXPOSE 3000
