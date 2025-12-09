# Etapa 1: Construir la aplicación React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Pasar la URL de la API como argumento de construcción a Vite
ARG VITE_REACT_APP_API_URL
ENV VITE_REACT_APP_API_URL=${VITE_REACT_APP_API_URL}
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copiar la configuración de Nginx y el script de inicio
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh # Dar permisos de ejecución al script

EXPOSE 80

# Ejecutar el script de inicio
CMD ["/start.sh"]
