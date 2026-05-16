FROM node:18-alpine

WORKDIR /app

# Instalamos el CLI de Angular de forma global
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

# Exponemos el puerto de Angular
EXPOSE 4200

# Muy importante: --host 0.0.0.0 permite que el contenedor sea visible desde afuera
CMD ["ng", "serve", "--host", "0.0.0.0"]