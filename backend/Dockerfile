# Usamos una imagen ligera de Node.js
FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías
RUN npm install

# Copiamos el resto del código del backend
COPY . .

# Exponemos el puerto que usa tu API (ajusta si usas otro)
EXPOSE 3000

# Comando para arrancar en modo desarrollo
CMD ["npm", "run", "dev"]