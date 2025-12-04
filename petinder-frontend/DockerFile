# Etapa 1: Construir la aplicación React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Usar --legacy-peer-deps para resolver el conflicto de React
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:stable-alpine
# Copiar los archivos compilados de React
COPY --from=build /app/dist /usr/share/nginx/html
# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]