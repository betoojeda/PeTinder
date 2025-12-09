# Etapa 1: Construir la aplicación React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar AMBOS archivos de configuración
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.prod.conf /etc/nginx/nginx.prod.conf

# El CMD ahora es un script que elige qué configuración usar
CMD /bin/sh -c "if [ -n \"$BACKEND_URL\" ]; then envsubst '\\\$BACKEND_URL' < /etc/nginx/nginx.prod.conf > /etc/nginx/conf.d/default.conf; else cp /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf; fi && nginx -g 'daemon off;'"
