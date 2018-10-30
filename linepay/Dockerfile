FROM node:alpine
WORKDIR /app

COPY ./linepay/ /app/
RUN npm install

EXPOSE 6789
CMD ["npm", "run", "start"]