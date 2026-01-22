#!/bin/bash
# Instrucciones para configurar el monitoreo automático en el servidor

# 1. Dar permisos de ejecución al script
chmod +x /home/lucvan5/server-pro/watchdog-monitor.sh

# 2. Ver el crontab actual
crontab -l

# 3. Editar el crontab (agregar una de estas líneas según lo que prefieras)
crontab -e

# ========== OPCIONES DE CRON ==========

# OPCIÓN 1: Verificar DIARIAMENTE cada hora (recomendado - bajo consumo)
0 * * * * /home/lucvan5/server-pro/watchdog-monitor.sh

# OPCIÓN 2: Verificar CADA 6 HORAS (muy eficiente)
0 */6 * * * /home/lucvan5/server-pro/watchdog-monitor.sh

# OPCIÓN 3: Verificar SEMANALMENTE (una vez por semana)
0 0 * * 0 /home/lucvan5/server-pro/watchdog-monitor.sh

# OPCIÓN 4: Verificar CADA 15 MINUTOS (máxima vigilancia)
*/15 * * * * /home/lucvan5/server-pro/watchdog-monitor.sh

# ========== VERIFICAR LOGS ==========
# Para ver el historial de monitoreo:
tail -50 /home/lucvan5/server-pro/watchdog.log

# Para ver logs en tiempo real:
tail -f /home/lucvan5/server-pro/watchdog.log
