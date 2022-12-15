FROM node:16
WORKDIR /app
COPY . /app
RUN rm -rf package-lock.json
RUN rm -rf node_modules/*
RUN npm install
EXPOSE 8080
CMD ["node", "app.js"]
