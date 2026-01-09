#!/bin/bash

# Script para configurar acceso público a archivos en el servidor

echo "🔧 Configurando acceso público a archivos..."

cd /home/lucvan5/server-pro

# 1. Asegurar que la carpeta uploads existe y tiene permisos correctos
echo "📁 Ajustando permisos de carpeta uploads..."
mkdir -p uploads
chmod 755 uploads

# 2. Crear un archivo .htaccess para servir archivos con headers correctos
echo "📋 Creando configuración Apache..."
cat > uploads/.htaccess << 'EOF'
<IfModule mod_mime.c>
    AddType application/pdf .pdf
    AddType image/jpeg .jpg .jpeg
    AddType image/png .png
    AddType image/webp .webp
    AddType application/msword .doc .docx
    AddType application/vnd.ms-excel .xls .xlsx
</IfModule>

<IfModule mod_headers.c>
    Header set Cache-Control "public, max-age=3600"
    Header set Access-Control-Allow-Origin "*"
</IfModule>

# Permitir acceso directo a archivos
<FilesMatch "\.pdf$|\.jpg$|\.jpeg$|\.png$|\.webp$|\.doc$|\.docx$|\.xls$|\.xlsx$">
    Require all granted
</FilesMatch>
EOF

# 3. Crear script Node.js para servir archivos si No está en Apache
echo "📝 Configuración lista"
echo ""
echo "✅ Permisos ajustados:"
ls -ld uploads/
echo ""
echo "💡 Los archivos ahora están en:"
echo "   URL: https://sistema.lucvanlatam.com/uploads/[request-id]/[filename]"
echo "   O vía API: /api/uploads/[request-id]/[filename]"
