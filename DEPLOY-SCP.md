# Deploy Manual por SCP

## 🔐 Configuración

**Servidor:** ngx367.inmotionhosting.com
**Usuario:** lucvan5
**Puerto:** 2222
**Llave SSH:** En carpeta Descargas

---

## 📤 Comandos para Deploy

### Paso 1: Ir a la carpeta del proyecto
```powershell
cd C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema
```

### Paso 2: Crear build de producción
```powershell
npm run build
```

### Paso 3: Subir archivos por SCP

#### Opción A: Si la llave se llama `id_rsa` o `lucvan.pem`
```powershell
# Frontend (dist/)
scp -P 2222 -i C:\Users\Angie\Downloads\id_rsa -r dist/* lucvan5@ngx367.inmotionhosting.com:~/public_html/

# Backend (archivos .js, package.json, etc)
scp -P 2222 -i C:\Users\Angie\Downloads\id_rsa -r backend lucvan5@ngx367.inmotionhosting.com:~/
scp -P 2222 -i C:\Users\Angie\Downloads\id_rsa package.json lucvan5@ngx367.inmotionhosting.com:~/
```

#### Opción B: Si la llave tiene otro nombre (reemplaza NOMBRE_LLAVE)
```powershell
# Frontend
scp -P 2222 -i C:\Users\Angie\Downloads\NOMBRE_LLAVE -r dist/* lucvan5@ngx367.inmotionhosting.com:~/public_html/

# Backend
scp -P 2222 -i C:\Users\Angie\Downloads\NOMBRE_LLAVE -r backend lucvan5@ngx367.inmotionhosting.com:~/
scp -P 2222 -i C:\Users\Angie\Downloads\NOMBRE_LLAVE package.json lucvan5@ngx367.inmotionhosting.com:~/
```

### Paso 4: Conectarse al servidor e instalar dependencias
```powershell
ssh -p 2222 -i C:\Users\Angie\Downloads\NOMBRE_LLAVE lucvan5@ngx367.inmotionhosting.com
```

Dentro del servidor:
```bash
cd ~
npm install --production
pm2 restart all   # O el comando que uses para reiniciar
```

---

## 🚨 Si pide contraseña de la llave

La llave SSH puede tener contraseña. Cuando ejecutes el comando, te pedirá:
```
Enter passphrase for key 'C:\Users\Angie\Downloads\NOMBRE_LLAVE':
```

Ingresa tu contraseña.

---

## ⚡ Comando Todo-en-Uno (Ejecutar en PowerShell)

```powershell
# Variables (ajusta el nombre de la llave)
$LLAVE = "C:\Users\Angie\Downloads\id_rsa"
$SERVER = "lucvan5@ngx367.inmotionhosting.com"
$PORT = "2222"

# Build
npm run build

# Subir frontend
scp -P $PORT -i $LLAVE -r dist/* ${SERVER}:~/public_html/

# Subir backend
scp -P $PORT -i $LLAVE -r backend ${SERVER}:~/
scp -P $PORT -i $LLAVE package.json ${SERVER}:~/
scp -P $PORT -i $LLAVE index.server.js ${SERVER}:~/

Write-Host "✅ Archivos subidos. Conéctate al servidor para instalar dependencias."
```

---

## 📝 Checklist

- [ ] Build generado (`npm run build`)
- [ ] Frontend subido a `~/public_html/`
- [ ] Backend subido a `~/`
- [ ] `package.json` subido
- [ ] Conectado al servidor
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor reiniciado (`pm2 restart all`)
- [ ] Verificar en navegador

---

## 🔍 Verificar archivos en Descargas

```powershell
Get-ChildItem C:\Users\Angie\Downloads\*.pem
Get-ChildItem C:\Users\Angie\Downloads\id_*
Get-ChildItem C:\Users\Angie\Downloads\*key*
```

Esto mostrará las llaves disponibles.
