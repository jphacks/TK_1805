FROM node:alpine
ENV APP_ROOT /floormap

RUN mkdir $APP_ROOT
WORKDIR $APP_ROOT
ADD floormap/ $APP_ROOT
RUN npm install

EXPOSE 4646
CMD [ "npm", "run", "start" ]
