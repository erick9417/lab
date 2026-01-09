#!/bin/bash

# Script rápido para hacer build y copiar a servidor

# 1. Build
echo "Compilando frontend..."
npm run build

if [ ! -d "dist" ]; then
  echo "Error: no se generó dist/"
  exit 1
fi

echo "✓ Build completado en dist/"

# 2. Copiar a servidor (ajusta según tu setup)
# Ejemplo con scp:
# scp -r dist/* usuario@servidor:/var/www/lucvan/

echo ""
echo "Para copiar a servidor:"
echo "  scp -r dist/* usuario@tu-servidor:/ruta/al/servidor/"
echo ""
echo "O si usas Nginx en local (Windows):"
echo "  - Copia dist/* a C:\\nginx\\html\\ (o tu ruta)"
echo "  - Configura reverse proxy en nginx.conf:"
echo "    location /api/ {"
echo "      proxy_pass http://127.0.0.1:3000/;"
echo "    }"

