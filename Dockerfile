FROM node:16.19.0

WORKDIR /server

COPY ./package.json .
RUN npm install

COPY . .

EXPOSE 8000

CMD npm start
