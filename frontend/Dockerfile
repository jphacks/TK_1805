FROM node:alpine
ENV APP_ROOT /frontend

WORKDIR $APP_ROOT
COPY package.json $APP_ROOT
COPY yarn.lock $APP_ROOT
RUN yarn

COPY . $APP_ROOT
RUN yarn run build

EXPOSE 3000
CMD [ "yarn", "start" ]
