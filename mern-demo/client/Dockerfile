<<<<<<< HEAD
FROM node:20
=======
FROM node:20-alpine
>>>>>>> 52fbe87 (Complete Lab 04 Docker Hub Multi-Container)

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

<<<<<<< HEAD
EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
=======
EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
>>>>>>> 52fbe87 (Complete Lab 04 Docker Hub Multi-Container)
