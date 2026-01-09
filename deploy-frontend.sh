#!/bin/bash

# Deploy script para actualizar el frontend en el servidor
# USO: ssh -p 2222 user@host "bash < deploy-frontend.sh"

echo "📦 Actualizando frontend en server-pro..."

cd /home/lucvan5/server-pro

# Descargar archivos compilados del repositorio
echo "⬇️  Descargando archivos compilados..."
mkdir -p dist-tmp
cd dist-tmp

# Descargar index.html y assets
curl -s -O https://raw.githubusercontent.com/erick9417/lab/master/dist/index.html

# Descargar assets
mkdir -p assets
cd assets
curl -s -O https://raw.githubusercontent.com/erick9417/lab/master/dist/assets/index-C-HjYfUC.js
curl -s -O https://raw.githubusercontent.com/erick9417/lab/master/dist/assets/index-C-HjYfUC.js.map
curl -s -O https://raw.githubusercontent.com/erick9417/lab/master/dist/assets/index-DKYRqYZ3.css
cd ..

# Respaldar y reemplazar
echo "💾 Respaldando archivos anteriores..."
if [ -d ../dist ]; then
  mv ../dist ../dist.backup.$(date +%s)
fi

# Mover nuevos archivos
mv . ../dist
cd ..
rmdir dist-tmp 2>/dev/null || true

echo "✅ Frontend actualizado exitosamente"
ls -la dist/ | head -20
