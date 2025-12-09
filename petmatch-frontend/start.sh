#!/bin/sh

# Establecer un valor por defecto para el backend si no se proporciona
# Para Railway, usaremos BACKEND_URL. Para local, usará el valor por defecto.
API_URL=${BACKEND_URL:-http://backend:8080}

echo "Setting backend API URL to: ${API_URL}"

# Reemplazar el placeholder en el archivo de configuración de Nginx
sed -i "s|BACKEND_API_URL|${API_URL}|g" /etc/nginx/conf.d/default.conf

# Iniciar Nginx en primer plano
nginx -g "daemon off;"
