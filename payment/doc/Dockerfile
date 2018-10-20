FROM node:alpine

WORKDIR /app

COPY doc/ /app/

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]