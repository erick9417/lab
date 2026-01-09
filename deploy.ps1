# Script de Deploy al Servidor de Producción
# Servidor: ngx367.inmotionhosting.com
# Usuario: lucvan5
# Puerto: 2222

# ============================================
# 1. BUILD DEL FRONTEND
# ============================================

Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# ============================================
# 2. SUBIR ARCHIVOS AL SERVIDOR
# ============================================

Write-Host "`n📤 Uploading files to server..." -ForegroundColor Yellow

# Backend files
Write-Host "  • Uploading backend..." -ForegroundColor Cyan
scp -P 2222 -r backend lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/

# Frontend build (dist)
Write-Host "  • Uploading frontend build..." -ForegroundColor Cyan
scp -P 2222 -r dist lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/

# Package files
Write-Host "  • Uploading package.json..." -ForegroundColor Cyan
scp -P 2222 package.json lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
scp -P 2222 package-lock.json lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/

# Server files
Write-Host "  • Uploading server files..." -ForegroundColor Cyan
scp -P 2222 index.server.js lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
scp -P 2222 vite.config.js lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/

Write-Host "`n✅ Upload completed!" -ForegroundColor Green

# ============================================
# 3. INSTALAR DEPENDENCIAS EN SERVIDOR
# ============================================

Write-Host "`n📦 Installing dependencies on server..." -ForegroundColor Yellow
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "cd ~/lucvan-sistema && npm install --production"

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# ============================================
# 4. REINICIAR APLICACIÓN
# ============================================

Write-Host "`n🔄 Restarting application..." -ForegroundColor Yellow
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "cd ~/lucvan-sistema && pm2 restart lucvan-sistema || pm2 start index.server.js --name lucvan-sistema"

Write-Host "✅ Application restarted" -ForegroundColor Green

Write-Host "`n🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 URL: https://sistema.lucvanlatam.com" -ForegroundColor Cyan
