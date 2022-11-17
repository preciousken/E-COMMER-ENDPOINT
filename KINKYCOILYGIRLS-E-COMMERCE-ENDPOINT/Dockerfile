FROM node:slim
WORKDIR /src/app
COPY package.json /src/app
COPY .env /src/app
COPY tsconfig.json /src/app

COPY src /src/app
RUN npm install
RUN npm run build

EXPOSE 7000

CMD ["npm", "start"]