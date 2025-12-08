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
# Copiar la plantilla de configuración de Nginx
COPY nginx.conf /etc/nginx/templates/default.conf.template

# El CMD ahora es un script que primero procesa la plantilla y luego inicia Nginx
CMD /bin/sh -c "envsubst '__BACKEND_URL__' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
