FROM node:18-alpine

WORKDIR /app

ARG VITE_API_URL

COPY /frontend /app/
RUN npm install
RUN VITE_API_URL=$VITE_API_URL npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]