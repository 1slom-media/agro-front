# SunAgro Deployment Guide

Bu qo'llanma SunAgro loyihasini Ubuntu serverga deploy qilish uchun batafsil ko'rsatmalarni o'z ichiga oladi.

## 📋 Mundarija

1. [Server Talablari](#server-talablari)
2. [GitHub Repository Sozlash](#github-repository-sozlash)
3. [Server Dastlabki Sozlash](#server-dastlabki-sozlash)
4. [Docker va Docker Compose O'rnatish](#docker-va-docker-compose-ornatish)
5. [Environment Variables Sozlash](#environment-variables-sozlash)
6. [Database Sozlash](#database-sozlash)
7. [Nginx Reverse Proxy Sozlash](#nginx-reverse-proxy-sozlash)
8. [SSL Sertifikat (Let's Encrypt)](#ssl-sertifikat-lets-encrypt)
9. [CI/CD Pipeline Sozlash](#cicd-pipeline-sozlash)
10. [Deployment Jarayoni](#deployment-jarayoni)
11. [Monitoring va Maintenance](#monitoring-va-maintenance)
12. [Muammolarni Hal Qilish](#muammolarni-hal-qilish)

---

## 🖥️ Server Talablari

### Minimal Talablar:
- **OS**: Ubuntu 20.04 LTS yoki yangiroq
- **RAM**: 2GB (4GB tavsiya etiladi)
- **CPU**: 2 core (4 core tavsiya etiladi)
- **Disk**: 20GB bo'sh joy
- **Internet**: Barqaror internet ulanishi

### Tavsiya Etilgan:
- **RAM**: 4GB+
- **CPU**: 4 core+
- **Disk**: 50GB+ SSD
- **Domain**: Domena nomi (masalan: sunagro.uz)

---

## 🔧 GitHub Repository Sozlash

### 1. Frontend Repository Sozlash

1. GitHub'da yangi repository yarating: `sunagro-frontend`
2. Repository'ni clone qiling:
```bash
git clone https://github.com/yourusername/sunagro-frontend.git
cd sunagro-frontend
```

3. `.env.production` fayl yarating:
```bash
cp .env.example .env.production
```

4. `.env.production` faylini tahrirlang:
```env
NEXT_PUBLIC_API_URL=https://api.sunagro.uz
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

5. GitHub Secrets sozlash (Settings → Secrets and variables → Actions):
   - `DOCKER_USERNAME`: Docker Hub username
   - `DOCKER_PASSWORD`: Docker Hub password
   - `SERVER_HOST`: Server IP yoki domain
   - `SERVER_USER`: SSH username (odatda `root` yoki `ubuntu`)
   - `SSH_PRIVATE_KEY`: SSH private key
   - `FRONTEND_DOCKER_IMAGE`: `yourusername/sunagro-frontend:latest`

### 2. Backend Repository Sozlash

1. GitHub'da yangi repository yarating: `sunagro-backend`
2. Repository'ni clone qiling:
```bash
git clone https://github.com/yourusername/sunagro-backend.git
cd sunagro-backend
```

3. `.env.production` fayl yarating:
```bash
cp .env.example .env.production
```

4. `.env.production` faylini tahrirlang:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://sunagro_user:your_password@postgres:5432/sunagro_db
JWT_SECRET=your_super_secret_jwt_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

5. GitHub Secrets sozlash (Settings → Secrets and variables → Actions):
   - `DOCKER_USERNAME`: Docker Hub username
   - `DOCKER_PASSWORD`: Docker Hub password
   - `SERVER_HOST`: Server IP yoki domain
   - `SERVER_USER`: SSH username
   - `SSH_PRIVATE_KEY`: SSH private key
   - `BACKEND_DOCKER_IMAGE`: `yourusername/sunagro-backend:latest`

---

## 🚀 Server Dastlabki Sozlash

### 1. Serverga Ulanish

```bash
ssh root@your_server_ip
# yoki
ssh ubuntu@your_server_ip
```

### 2. Sistemani Yangilash

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git ufw
```

### 3. Firewall Sozlash

```bash
# SSH portini ochish
sudo ufw allow 22/tcp

# HTTP va HTTPS portlarini ochish
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Firewall'ni yoqish
sudo ufw enable
sudo ufw status
```

### 4. Yangi User Yaratish (ixtiyoriy, lekin tavsiya etiladi)

```bash
# Yangi user yaratish
sudo adduser deployer
sudo usermod -aG sudo deployer

# SSH key qo'shish
sudo mkdir -p /home/deployer/.ssh
sudo cp ~/.ssh/authorized_keys /home/deployer/.ssh/
sudo chown -R deployer:deployer /home/deployer/.ssh
sudo chmod 700 /home/deployer/.ssh
sudo chmod 600 /home/deployer/.ssh/authorized_keys
```

---

## 🐳 Docker va Docker Compose O'rnatish

### 1. Docker O'rnatish

```bash
# Eski versiyalarni o'chirish
sudo apt remove -y docker docker-engine docker.io containerd runc

# Docker repository qo'shish
sudo apt install -y ca-certificates gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker o'rnatish
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker'ni ishga tushirish
sudo systemctl start docker
sudo systemctl enable docker

# User'ni docker guruhiga qo'shish
sudo usermod -aG docker $USER
# Yoki yangi user uchun:
sudo usermod -aG docker deployer

# Docker versiyasini tekshirish
docker --version
docker compose version
```

### 2. Docker Compose O'rnatish (agar alohida kerak bo'lsa)

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

---

## 📁 Loyiha Strukturasi Yaratish

### 1. Loyiha Kataloglarini Yaratish

```bash
# Asosiy katalog
sudo mkdir -p /opt/sunagro
sudo chown -R $USER:$USER /opt/sunagro
cd /opt/sunagro

# Frontend va Backend kataloglari
mkdir -p frontend backend nginx ssl
```

### 2. Environment Files Yaratish

#### Frontend `.env.production`:
```bash
nano /opt/sunagro/frontend/.env.production
```

```env
NEXT_PUBLIC_API_URL=https://api.sunagro.uz
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Backend `.env.production`:
```bash
nano /opt/sunagro/backend/.env.production
```

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://sunagro_user:your_strong_password@postgres:5432/sunagro_db
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
CORS_ORIGIN=https://sunagro.uz,https://www.sunagro.uz
```

---

## 🗄️ Database Sozlash

### 1. PostgreSQL Docker Image Yaratish

```bash
nano /opt/sunagro/docker-compose.yml
```

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: sunagro-postgres
    restart: always
    environment:
      POSTGRES_USER: sunagro_user
      POSTGRES_PASSWORD: your_strong_password
      POSTGRES_DB: sunagro_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - sunagro-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sunagro_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: yourusername/sunagro-backend:latest
    container_name: sunagro-backend
    restart: always
    env_file:
      - ./backend/.env.production
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - sunagro-network
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    image: yourusername/sunagro-frontend:latest
    container_name: sunagro-frontend
    restart: always
    env_file:
      - ./frontend/.env.production
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - sunagro-network

volumes:
  postgres_data:
    driver: local

networks:
  sunagro-network:
    driver: bridge
```

### 2. Database'ni Ishga Tushirish

```bash
cd /opt/sunagro
docker compose up -d postgres

# Database'ning tayyor bo'lishini kutish
docker compose logs -f postgres
```

### 3. Database Migration'larini Ishlatish

```bash
# Backend container'ni ishga tushirish
docker compose up -d backend

# Migration'larni ishga tushirish (agar backend'da migration script bo'lsa)
docker compose exec backend npm run migration:run
# yoki
docker compose exec backend npm run typeorm migration:run
```

---

## 🌐 Nginx Reverse Proxy Sozlash

### 1. Nginx O'rnatish

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Nginx Konfiguratsiyasi

```bash
sudo nano /etc/nginx/sites-available/sunagro
```

```nginx
# Frontend uchun
server {
    listen 80;
    server_name sunagro.uz www.sunagro.uz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API uchun
server {
    listen 80;
    server_name api.sunagro.uz;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Nginx'ni Aktivlashtirish

```bash
sudo ln -s /etc/nginx/sites-available/sunagro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 SSL Sertifikat (Let's Encrypt)

### 1. Certbot O'rnatish

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. SSL Sertifikat Olish

```bash
# Frontend uchun
sudo certbot --nginx -d sunagro.uz -d www.sunagro.uz

# Backend API uchun
sudo certbot --nginx -d api.sunagro.uz
```

### 3. Avtomatik Yangilanish

Certbot avtomatik ravishda `certbot.timer` orqali sertifikatlarni yangilaydi. Tekshirish:

```bash
sudo systemctl status certbot.timer
```

### 4. Nginx Konfiguratsiyasini SSL uchun Yangilash

Certbot avtomatik ravishda Nginx konfiguratsiyasini yangilaydi. Agar qo'lda yangilash kerak bo'lsa:

```bash
sudo nano /etc/nginx/sites-available/sunagro
```

```nginx
# Frontend uchun
server {
    listen 80;
    server_name sunagro.uz www.sunagro.uz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sunagro.uz www.sunagro.uz;

    ssl_certificate /etc/letsencrypt/live/sunagro.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sunagro.uz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API uchun
server {
    listen 80;
    server_name api.sunagro.uz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.sunagro.uz;

    ssl_certificate /etc/letsencrypt/live/api.sunagro.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.sunagro.uz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔄 CI/CD Pipeline Sozlash

### 1. Frontend GitHub Actions Workflow

`.github/workflows/deploy.yml` faylini yangilang:

```yaml
name: Build and Deploy Frontend

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_GEMINI_API_KEY: ${{ secrets.NEXT_PUBLIC_GEMINI_API_KEY }}

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Docker image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/sunagro-frontend:${{ github.sha }} .
          docker build -t ${{ secrets.DOCKER_USERNAME }}/sunagro-frontend:latest .

      - name: Push Docker image
        run: |
          docker push ${{ secrets.DOCKER_USERNAME }}/sunagro-frontend:${{ github.sha }}
          docker push ${{ secrets.DOCKER_USERNAME }}/sunagro-frontend:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/sunagro
            docker compose pull frontend
            docker compose up -d frontend
            docker image prune -f
```

### 2. Backend GitHub Actions Workflow

`backend/.github/workflows/deploy.yml` faylini yangilang:

```yaml
name: Build and Deploy Backend

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci
        working-directory: ./backend

      - name: Build application
        run: npm run build
        working-directory: ./backend

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Docker image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/sunagro-backend:${{ github.sha }} -f backend/Dockerfile .
          docker build -t ${{ secrets.DOCKER_USERNAME }}/sunagro-backend:latest -f backend/Dockerfile .

      - name: Push Docker image
        run: |
          docker push ${{ secrets.DOCKER_USERNAME }}/sunagro-backend:${{ github.sha }}
          docker push ${{ secrets.DOCKER_USERNAME }}/sunagro-backend:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/sunagro
            docker compose pull backend
            docker compose up -d backend
            docker compose exec backend npm run migration:run || true
            docker image prune -f
```

---

## 🚀 Deployment Jarayoni

### 1. Birinchi Deployment (Qo'lda)

```bash
# Serverga ulanish
ssh user@your_server_ip

# Loyiha katalogiga o'tish
cd /opt/sunagro

# Docker Compose faylini yaratish (yuqoridagi misolni ishlatish)
nano docker-compose.yml

# Environment fayllarni yaratish
nano frontend/.env.production
nano backend/.env.production

# Docker image'larni yuklab olish
docker compose pull

# Container'larni ishga tushirish
docker compose up -d

# Loglarni ko'rish
docker compose logs -f
```

### 2. Avtomatik Deployment

GitHub Actions orqali avtomatik deploy qilish:

1. Kodni GitHub'ga push qiling:
```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

2. GitHub Actions workflow avtomatik ishga tushadi
3. Docker image'lar build qilinadi va Docker Hub'ga push qilinadi
4. Server'da yangi image'lar yuklab olinadi va container'lar yangilanadi

### 3. Manual Deployment

```bash
# Serverga ulanish
ssh user@your_server_ip

# Yangi image'larni yuklab olish
cd /opt/sunagro
docker compose pull

# Container'larni yangilash
docker compose up -d

# Eski image'larni tozalash
docker image prune -f
```

---

## 📊 Monitoring va Maintenance

### 1. Container Statusini Tekshirish

```bash
cd /opt/sunagro
docker compose ps
```

### 2. Loglarni Ko'rish

```bash
# Barcha loglar
docker compose logs -f

# Faqat backend loglari
docker compose logs -f backend

# Faqat frontend loglari
docker compose logs -f frontend

# Faqat database loglari
docker compose logs -f postgres
```

### 3. Resource Usage

```bash
# Container'lar resurslarini ko'rish
docker stats

# Disk foydalanishini ko'rish
df -h
docker system df
```

### 4. Backup Script

```bash
nano /opt/sunagro/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/sunagro/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
docker compose exec -T postgres pg_dump -U sunagro_user sunagro_db > $BACKUP_DIR/db_backup_$DATE.sql

# Uploads backup
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /opt/sunagro/backend/uploads

# Eski backup'larni o'chirish (30 kundan eski)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x /opt/sunagro/backup.sh

# Crontab'ga qo'shish (har kuni ertalab 3:00 da)
crontab -e
# Qo'shing:
0 3 * * * /opt/sunagro/backup.sh >> /opt/sunagro/backup.log 2>&1
```

### 5. Health Check Script

```bash
nano /opt/sunagro/health-check.sh
```

```bash
#!/bin/bash

# Frontend health check
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "Frontend is down! Restarting..."
    cd /opt/sunagro
    docker compose restart frontend
fi

# Backend health check
if ! curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "Backend is down! Restarting..."
    cd /opt/sunagro
    docker compose restart backend
fi

# Database health check
if ! docker compose exec -T postgres pg_isready -U sunagro_user > /dev/null 2>&1; then
    echo "Database is down! Restarting..."
    cd /opt/sunagro
    docker compose restart postgres
fi
```

```bash
chmod +x /opt/sunagro/health-check.sh

# Crontab'ga qo'shish (har 5 minutda)
crontab -e
# Qo'shing:
*/5 * * * * /opt/sunagro/health-check.sh >> /opt/sunagro/health-check.log 2>&1
```

---

## 🔧 Muammolarni Hal Qilish

### 1. Container Ishlamayapti

```bash
# Container statusini ko'rish
docker compose ps

# Loglarni ko'rish
docker compose logs container_name

# Container'ni qayta ishga tushirish
docker compose restart container_name

# Container'ni to'liq qayta yaratish
docker compose up -d --force-recreate container_name
```

### 2. Database Ulanish Muammosi

```bash
# Database container'ini tekshirish
docker compose ps postgres

# Database loglarini ko'rish
docker compose logs postgres

# Database'ga ulanish
docker compose exec postgres psql -U sunagro_user -d sunagro_db
```

### 3. Nginx Muammosi

```bash
# Nginx konfiguratsiyasini tekshirish
sudo nginx -t

# Nginx loglarini ko'rish
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Nginx'ni qayta ishga tushirish
sudo systemctl restart nginx
```

### 4. SSL Sertifikat Muammosi

```bash
# Sertifikat holatini tekshirish
sudo certbot certificates

# Sertifikatni qo'lda yangilash
sudo certbot renew --dry-run

# Sertifikatni to'liq yangilash
sudo certbot renew
```

### 5. Port Muammosi

```bash
# Port'lar ishlatilayotganini tekshirish
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :5432

# Port'ni ishlatayotgan process'ni topish
sudo lsof -i :3000
```

### 6. Disk Joyi Tugab Qolgan

```bash
# Disk foydalanishini ko'rish
df -h

# Docker resurslarini tozalash
docker system prune -a --volumes

# Eski image'larni o'chirish
docker image prune -a

# Eski container'larni o'chirish
docker container prune
```

### 7. Environment Variables Muammosi

```bash
# Container ichidagi environment variable'larni ko'rish
docker compose exec container_name env

# .env faylini tekshirish
cat /opt/sunagro/frontend/.env.production
cat /opt/sunagro/backend/.env.production
```

---

## 📝 Foydali Buyruqlar

### Docker Compose Buyruqlari

```bash
# Barcha container'larni ishga tushirish
docker compose up -d

# Container'larni to'xtatish
docker compose stop

# Container'larni o'chirish
docker compose down

# Loglarni ko'rish
docker compose logs -f

# Yangi image'larni yuklab olish
docker compose pull

# Container'larni qayta yaratish
docker compose up -d --force-recreate

# Faqat bitta serviceni qayta ishga tushirish
docker compose restart service_name
```

### Database Buyruqlari

```bash
# Database'ga ulanish
docker compose exec postgres psql -U sunagro_user -d sunagro_db

# Backup olish
docker compose exec postgres pg_dump -U sunagro_user sunagro_db > backup.sql

# Backup'ni tiklash
docker compose exec -T postgres psql -U sunagro_user -d sunagro_db < backup.sql
```

### System Buyruqlari

```bash
# Server resurslarini ko'rish
htop
# yoki
top

# Disk foydalanishini ko'rish
df -h

# Memory foydalanishini ko'rish
free -h

# Network ulanishini tekshirish
ping google.com
```

---

## ✅ Deployment Checklist

### Dastlabki Sozlash
- [ ] Server tayyor (Ubuntu 20.04+)
- [ ] Domain nomi sozlangan
- [ ] DNS record'lar sozlangan (A record)
- [ ] SSH key'lar sozlangan
- [ ] Firewall sozlangan

### GitHub Sozlash
- [ ] Frontend repository yaratilgan
- [ ] Backend repository yaratilgan
- [ ] GitHub Secrets sozlangan
- [ ] CI/CD workflow'lar yaratilgan

### Server Sozlash
- [ ] Docker o'rnatilgan
- [ ] Docker Compose o'rnatilgan
- [ ] Nginx o'rnatilgan
- [ ] Certbot o'rnatilgan
- [ ] Loyiha kataloglari yaratilgan

### Environment Variables
- [ ] Frontend `.env.production` sozlangan
- [ ] Backend `.env.production` sozlangan
- [ ] Barcha API key'lar sozlangan
- [ ] Database parollari yaratilgan

### Database
- [ ] PostgreSQL container ishga tushirilgan
- [ ] Database yaratilgan
- [ ] Migration'lar ishlatilgan
- [ ] Backup script sozlangan

### SSL
- [ ] SSL sertifikat olingan
- [ ] Nginx SSL uchun sozlangan
- [ ] HTTPS ishlayapti

### Deployment
- [ ] Docker image'lar build qilingan
- [ ] Container'lar ishga tushirilgan
- [ ] Frontend ishlayapti
- [ ] Backend API ishlayapti
- [ ] Database ulangan

### Monitoring
- [ ] Health check script sozlangan
- [ ] Backup script sozlangan
- [ ] Log monitoring sozlangan

---

## 🎯 Keyingi Qadamlar

1. **Performance Optimization**:
   - CDN sozlash (Cloudflare)
   - Image optimization
   - Caching strategiyasi

2. **Security**:
   - Fail2ban sozlash
   - Regular security updates
   - Database encryption

3. **Monitoring**:
   - Sentry yoki boshqa error tracking
   - Uptime monitoring
   - Performance monitoring

4. **Scaling**:
   - Load balancer sozlash
   - Database replication
   - Horizontal scaling

---

## 📞 Yordam

Agar muammo yuzaga kelsa:
1. Loglarni tekshiring: `docker compose logs -f`
2. Container statusini tekshiring: `docker compose ps`
3. Nginx loglarini tekshiring: `sudo tail -f /var/log/nginx/error.log`
4. GitHub Issues'da muammo yozing

---

**Muvaffaqiyatli deployment! 🚀**
