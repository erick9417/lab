#!/bin/bash
# Daily Restart Script - Reinicia el servidor todos los días para limpiar memoria
# Ejecutar: 30 2 * * * /home/lucvan5/server-pro/daily-restart.sh
# (Cada día a las 2:30 AM)

LOG_FILE="/home/lucvan5/server-pro/watchdog.log"
SERVER_DIR="/home/lucvan5/server-pro"
PROCESS_NAME="index.server.full.js"

# Función para loguear
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_message "═══════════════════════════════════════════"
log_message "🔄 REINICIO DIARIO PROGRAMADO"
log_message "   Limpiando memoria..."

# Matar el proceso existente
PID=$(ps aux | grep -v grep | grep "$PROCESS_NAME" | awk '{print $2}' | head -1)

if [ -n "$PID" ]; then
    log_message "   Terminando proceso anterior (PID: $PID)..."
    kill -9 $PID 2>/dev/null
    sleep 2
    log_message "   ✅ Proceso terminado"
else
    log_message "   ℹ️ No había proceso corriendo"
fi

# Iniciar nuevamente
log_message "   Iniciando servidor..."
cd "$SERVER_DIR"
nohup node "$PROCESS_NAME" >> "$LOG_FILE" 2>&1 &
NEW_PID=$!
sleep 3

# Verificar que inició
if ps -p $NEW_PID > /dev/null 2>&1; then
    log_message "✅ REINICIO EXITOSO - Servidor en ejecución (PID: $NEW_PID)"
    log_message "   Memoria: LIMPIA (reiniciado)"
else
    log_message "❌ ERROR: El servidor no inició correctamente"
fi

log_message "═══════════════════════════════════════════"
