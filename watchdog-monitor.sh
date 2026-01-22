#!/bin/bash
# Watchdog Monitor - Verifica y reinicia el servidor si es necesario
# Ejecutar diariamente con cron: 0 * * * * /home/lucvan5/server-pro/watchdog-monitor.sh

LOG_FILE="/home/lucvan5/server-pro/watchdog.log"
SERVER_DIR="/home/lucvan5/server-pro"
PROCESS_NAME="index.server.full.js"
MAX_MEMORY_MB=500  # Si el servidor usa más de 500MB, reiniciar

# Función para loguear
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Verificar si el proceso está corriendo
check_process() {
    ps aux | grep -v grep | grep "$PROCESS_NAME" > /dev/null
    return $?
}

# Obtener el PID del proceso
get_pid() {
    ps aux | grep -v grep | grep "$PROCESS_NAME" | awk '{print $2}' | head -1
}

# Verificar uso de memoria
check_memory() {
    PID=$(get_pid)
    if [ -z "$PID" ]; then
        return 1
    fi
    
    MEMORY=$(ps aux | awk -v pid=$PID '$2 == pid {print $6}')  # En KB
    MEMORY_MB=$((MEMORY / 1024))
    
    if [ $MEMORY_MB -gt $MAX_MEMORY_MB ]; then
        log_message "⚠️ ALERTA: Uso de memoria alto: ${MEMORY_MB}MB (límite: ${MAX_MEMORY_MB}MB)"
        return 0  # Necesita reinicio
    fi
    return 1
}

# Verificar conectividad del servidor (health check)
check_health() {
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/health 2>/dev/null || echo "000")
    if [ "$RESPONSE" != "200" ]; then
        log_message "❌ Health check falló (HTTP $RESPONSE)"
        return 0  # Necesita reinicio
    fi
    return 1
}

# Reiniciar el servidor
restart_server() {
    log_message "🔄 Intentando reiniciar servidor..."
    
    # Matar el proceso existente
    PID=$(get_pid)
    if [ -n "$PID" ]; then
        kill -9 $PID 2>/dev/null
        log_message "   Proceso anterior terminado (PID: $PID)"
        sleep 2
    fi
    
    # Iniciar nuevamente
    cd "$SERVER_DIR"
    nohup node "$PROCESS_NAME" >> "$LOG_FILE" 2>&1 &
    NEW_PID=$!
    sleep 2
    
    if check_process; then
        log_message "✅ Servidor reiniciado exitosamente (PID: $NEW_PID)"
        return 0
    else
        log_message "❌ ERROR: No se pudo reiniciar el servidor"
        return 1
    fi
}

# ========== LÓGICA PRINCIPAL ==========

log_message "🔍 Iniciando verificación de monitoreo..."

if ! check_process; then
    log_message "❌ PROBLEMA: Servidor NO está corriendo"
    restart_server
elif check_memory; then
    log_message "⚠️ PROBLEMA: Memoria muy alta, reiniciando..."
    restart_server
elif check_health; then
    log_message "⚠️ PROBLEMA: Health check falló, reiniciando..."
    restart_server
else
    log_message "✅ OK: Servidor está corriendo correctamente"
fi

log_message "═══════════════════════════════════════════"
