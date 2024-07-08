FROM node:18-alpine

WORKDIR /app

COPY /frontend /app/
RUN npm install
RUN npm build

EXPOSE 3000

CMD ["npm", "run", "dev"]