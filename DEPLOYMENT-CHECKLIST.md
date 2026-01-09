# 📋 Checklist de Deploying - Lucván LATAM

## ✅ Pre-Deployment (Local Verification)

- [x] Build frontend: `npm run build` ✅
- [x] Backup schedule configured: Sundays 3:00 AM ✅
- [x] Backup retention: 365 days ✅
- [x] Green status badge for completed backups ✅
- [x] Email configuration prepared: `backuplucvanlatam@gmail.com` ✅
- [x] SSH key located: `C:\Users\Angie\Downloads\id_rsa` ✅

## 📦 Deployment Steps

### Step 1: Deploy Frontend (dist/)
```bash
scp -P 2222 -i C:\Users\Angie\Downloads\id_rsa -r dist/* lucvan5@ngx367.inmotionhosting.com:~/public_html/
```
**Expected:** All files copied to `/home/lucvan5/public_html/`

### Step 2: Deploy Backend Code
```bash
scp -P 2222 -i C:\Users\Angie\Downloads\id_rsa -r backend lucvan5@ngx367.inmotionhosting.com:~/
scp -P 2222 -i C:\Users\Angie\Downloads\id_rsa package.json index.server.js lucvan5@ngx367.inmotionhosting.com:~/
```
**Expected:** Backend code copied to `/home/lucvan5/backend/` and root files copied

### Step 3: SSH to Server and Create `.env`
```bash
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com
```

Then create `~/backend/.env`:
```env
# === Base de Datos MySQL ===
DB_HOST=localhost
DB_USER=lucvan5_admin
DB_PASSWORD=[PRODUCTION_BD_PASSWORD]
DB_NAME=lucvan5_sistema

# === Directorio de Backups ===
BACKUP_DIR=/home/lucvan5/backups

# === Email para recibir backups (SEPARATED ACCOUNT para disaster recovery) ===
BACKUP_EMAIL=backuplucvanlatam@gmail.com

# === Configuración SMTP (Gmail recomendado) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=backuplucvanlatam@gmail.com
SMTP_PASSWORD=Y2ez5sJsL67n.
SMTP_FROM=Lucván Backups <backuplucvanlatam@gmail.com>

# === Servidor ===
PORT=4000
NODE_ENV=production

# === Seguridad JWT ===
JWT_SECRET=[GENERATE_RANDOM_SECRET_KEY]
```

### Step 4: Install Dependencies
```bash
cd ~/backend
npm install --production
```

### Step 5: Create Backups Directory
```bash
mkdir -p ~/backups
chmod 755 ~/backups
```

### Step 6: Verify Database Connection
```bash
mysql -h localhost -u lucvan5_admin -p [PRODUCTION_BD_PASSWORD] lucvan5_sistema -e "SELECT VERSION();"
```
Expected: MySQL version displayed (connection successful)

### Step 7: Test Email Configuration
```bash
cd ~/backend
node -e "
require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Error:', error);
    process.exit(1);
  } else {
    console.log('✅ SMTP ready - Gmail connection successful');
    process.exit(0);
  }
});
" 
```

### Step 8: Start/Restart Backend
```bash
# If using PM2:
pm2 restart all

# Or if using systemd/manual:
cd ~/backend
NODE_ENV=production node index.server.js &
```

### Step 9: Verify Backend is Running
```bash
curl http://localhost:4000/health
```
Expected: Response indicating server is running

### Step 10: Verify Frontend is Accessible
```bash
curl https://ngx367.inmotionhosting.com
```
Or visit: `https://ngx367.inmotionhosting.com` in browser

## 🧪 Post-Deployment Verification

### Test Backup System
1. Go to Admin Dashboard → Backup
2. Click "🔄 Realizar Backup Ahora" (Manual Backup)
3. Verify backup appears in list
4. Check email: `backuplucvanlatam@gmail.com` should receive backup file

### Test Restore System (Partial)
1. Admin Dashboard → Backup
2. Select a backup → Click Restore
3. Choose "Parcial" (Partial) option
4. Select a clinic to restore
5. Verify restoration completed

### Monitor Automatic Backup
1. Check server logs:
   ```bash
   pm2 logs lucvan-api
   ```
2. Every Sunday at 3:00 AM, should see:
   ```
   [SCHEDULER] Running automatic backup...
   [BACKUP] Database backup created successfully
   [BACKUP] Email sent successfully
   [BACKUP CLEANUP] Deleted old backup files
   ```

## 🔐 Security Checklist

- [ ] `.env` file created with actual credentials
- [ ] `.env` file is NOT in git repository (add to `.gitignore`)
- [ ] Gmail account has 2FA enabled
- [ ] App Password used (NOT personal Gmail password)
- [ ] Database credentials are production credentials
- [ ] JWT_SECRET is unique and random (min 32 chars)
- [ ] Backup directory is readable by Node.js process
- [ ] Backups are automatically sent to external Gmail

## 📊 Configuration Summary

| Component | Value | Notes |
|-----------|-------|-------|
| **Backup Schedule** | Sundays 3:00 AM | `0 3 * * 0` |
| **Retention** | 365 days | Auto-cleanup enabled |
| **Backup Destination** | `/home/lucvan5/backups` | Local server directory |
| **Email Delivery** | `backuplucvanlatam@gmail.com` | External account for disaster recovery |
| **SMTP Auth** | `backuplucvanlatam@gmail.com` | Same account as backup destination |
| **Frontend URL** | `https://ngx367.inmotionhosting.com` | Production domain |
| **Backend Port** | 4000 | Internal, served via proxy |
| **Database** | `lucvan5_sistema` | MySQL local connection |

## 🚨 Troubleshooting

### Backup not showing in Admin Dashboard
1. Check server logs: `pm2 logs lucvan-api`
2. Verify `BACKUP_DIR` exists: `ls -la ~/backups/`
3. Check disk space: `df -h`
4. Verify backend is running: `pm2 list`

### Email not sending
1. Verify SMTP credentials in `.env`
2. Check Gmail 2FA is enabled
3. Verify App Password (NOT personal password)
4. Test with: `npm run test:email` (if available)
5. Check server logs for SMTP errors

### Database restore failing
1. Verify database credentials
2. Check database has correct permissions
3. Verify backup file is not corrupted
4. Check disk space on server

### Cannot connect via SSH
1. Verify SSH key path: `C:\Users\Angie\Downloads\id_rsa`
2. Check SSH port is correct: `2222`
3. Verify username: `lucvan5`
4. Try password authentication as fallback

## 📝 Notes

- All credentials are stored in `.env` (NOT in code)
- Backup system is file-based (no database tables needed)
- Scheduler runs automatically on server startup
- Email delivery is non-blocking (backup completes regardless of email)
- Retention cleanup runs after each backup creation
- External Gmail account provides disaster recovery protection

## 🎯 Success Criteria

✅ Frontend loads at `https://ngx367.inmotionhosting.com`
✅ Admin can login and access Dashboard
✅ Backup list shows existing backups
✅ Manual backup button works
✅ Backup files appear in `/home/lucvan5/backups/`
✅ Backup emails arrive at `backuplucvanlatam@gmail.com`
✅ Scheduler logs show "Every Sunday at 3:00 AM"
✅ Restore dialog allows selecting Global/Partial
✅ Partial restore shows clinic list
