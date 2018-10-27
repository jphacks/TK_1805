FROM node:alpine
ENV APP_ROOT /frontend

RUN mkdir $APP_ROOT
WORKDIR $APP_ROOT
COPY frontend/package.json $APP_ROOT
COPY frontend/yarn.lock $APP_ROOT
RUN yarn

COPY frontend/ $APP_ROOT
RUN yarn run build

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
