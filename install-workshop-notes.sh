#!/bin/bash

# Script de instalación para Workshop Notes
# Ejecutar en el servidor: bash ~/install-workshop-notes.sh

echo "=== Instalando Workshop Notes System ==="

# 1. Crear la tabla en la base de datos
echo "1. Creando tabla workshop_notes..."
mysql -u lucvan5 -p << 'EOF'
CREATE TABLE IF NOT EXISTS workshop_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  user_id INT,
  user_name VARCHAR(255),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  INDEX idx_request_id (request_id),
  INDEX idx_created_at (created_at)
);
EOF

if [ $? -eq 0 ]; then
  echo "✓ Tabla workshop_notes creada exitosamente"
else
  echo "✗ Error creando tabla"
  exit 1
fi

# 2. Agregar rutas al archivo requests.js
echo "2. Agregando rutas al archivo requests.js..."

# Crear backup
cp ~/server-pro/src/routes/requests.js ~/server-pro/src/routes/requests.js.backup

# Las rutas deben agregarse manualmente o con sed
echo "⚠️ ACCIÓN MANUAL REQUERIDA:"
echo "Agregar el siguiente código al final de ~/server-pro/src/routes/requests.js (antes del export):"
echo ""
echo "=================================================="
cat ~/create-workshop-notes-table.sql
echo "=================================================="
echo ""
echo "Luego reinicia el servidor:"
echo "  pm2 restart server-pro"
echo "  o"
echo "  systemctl restart node-server"

echo ""
echo "=== Instalación completada ==="
