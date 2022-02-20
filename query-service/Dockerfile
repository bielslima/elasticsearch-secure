FROM node:14.18.3-alpine

WORKDIR /code

COPY package.json /code/package.json
# COPY package-lock.json /code/package-lock.json

RUN npm install

COPY . /code

CMD [ "node", "src/index.js" ]