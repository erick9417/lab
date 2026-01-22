#!/bin/bash
# Instrucciones para configurar el monitoreo automático en el servidor

# ========== PASO 1: DAR PERMISOS DE EJECUCIÓN ==========
chmod +x /home/lucvan5/server-pro/watchdog-monitor.sh
chmod +x /home/lucvan5/server-pro/daily-restart.sh

# ========== PASO 2: VER CRONTAB ACTUAL ==========
crontab -l

# ========== PASO 3: EDITAR CRONTAB ==========
crontab -e

# ========== CONFIGURACIÓN RECOMENDADA ==========
# Agregar AMBAS líneas al crontab:

# Tarea 1: Monitoreo cada hora (verifica si está corriendo)
0 * * * * /home/lucvan5/server-pro/watchdog-monitor.sh

# Tarea 2: Reinicio diario a las 2:30 AM (limpia memoria)
30 2 * * * /home/lucvan5/server-pro/daily-restart.sh

# ========== QUÉ HACE CADA UNA ==========

# WATCHDOG-MONITOR.SH (cada hora)
# ✅ Verifica si el servidor está corriendo
# ✅ Si no está → lo reinicia
# ✅ Verifica consumo de memoria (máx 500MB)
# ✅ Verifica health check de la API
# ℹ️ Reinicia SOLO si hay problemas

# DAILY-RESTART.SH (2:30 AM cada día)
# ✅ Reinicia el servidor siempre
# ✅ Limpia la memoria acumulada
# ✅ Se ejecuta a hora de bajo uso
# ℹ️ Aunque el servidor esté bien, lo reinicia

# ========== VERIFICAR LOGS ==========
# Para ver el historial completo:
tail -100 /home/lucvan5/server-pro/watchdog.log

# Para ver logs en tiempo real:
tail -f /home/lucvan5/server-pro/watchdog.log

# Para ver solo eventos del día actual:
grep "$(date '+%Y-%m-%d')" /home/lucvan5/server-pro/watchdog.log

# ========== EJEMPLO DE TIMELINE DIARIO ==========
# 00:00 - Servidor corriendo
# 01:00 - Watchdog verifica → OK
# 02:00 - Watchdog verifica → OK
# 02:30 - REINICIO DIARIO programado ← LIMPIA MEMORIA
# 03:00 - Watchdog verifica → OK (memoria limpia)
# ...
# 23:00 - Watchdog verifica → OK
