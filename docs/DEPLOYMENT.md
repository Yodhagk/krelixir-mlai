# Deployment Guide — Hostinger / krelixir.ai

## Option A: Static Frontend + Separate Backend (Recommended)

### Frontend Deployment (Hostinger)

1. **Build the frontend:**
```bash
cd frontend
npm install
npm run build
# Output: frontend/dist/
```

2. **Upload to Hostinger:**
   - Log into Hostinger hPanel
   - Go to File Manager → public_html
   - Upload all files from `frontend/dist/` to `public_html/`
   - OR use FTP: `scp -r dist/* user@krelixir.ai:/public_html/`

3. **Configure .htaccess for React Router:**
Create `public_html/.htaccess`:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

4. **Point API calls to your backend:**
Update `frontend/.env.production`:
```
VITE_API_URL=https://api.krelixir.ai
```

And update `frontend/vite.config.js` build to use the correct API URL.

---

### Backend Deployment (VPS / Cloud)

**Option 1: Hostinger VPS**
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Clone repo
git clone https://github.com/your-org/krelixir-mlai.git /var/www/krelixir

# Install and start
cd /var/www/krelixir/backend
npm install --production
cp .env.example .env
nano .env  # Set your values

# Start with PM2
npm install -g pm2
pm2 start server.js --name "krelixir-api"
pm2 startup
pm2 save
```

**Option 2: Deploy as a Docker container**
```dockerfile
# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

```bash
docker build -t krelixir-api .
docker run -d -p 5000:5000 --env-file .env krelixir-api
```

---

## Option B: Full-Stack Deployment (Single Server)

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. The backend serves frontend from dist/
cd backend
NODE_ENV=production npm start
# Backend serves both API and frontend
```

Set `NODE_ENV=production` and the Express server will serve the React app from `../frontend/dist/`.

---

## Nginx Reverse Proxy Configuration

```nginx
server {
    server_name krelixir.ai www.krelixir.ai;

    # Frontend (static files)
    root /var/www/krelixir/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # SSL (Let's Encrypt)
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/krelixir.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/krelixir.ai/privkey.pem;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name krelixir.ai;
    return 301 https://$server_name$request_uri;
}
```

---

## SSL Certificate

```bash
# Using Certbot
apt install certbot python3-certbot-nginx
certbot --nginx -d krelixir.ai -d www.krelixir.ai
```

---

## Environment Variables (Production)

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=generate-a-strong-random-secret-minimum-32-chars
JWT_EXPIRES_IN=7d
DB_PATH=/var/www/krelixir/data/krelixir.db
OPENAI_API_KEY=sk-your-key
FRONTEND_URL=https://krelixir.ai
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## Performance Checklist

- [ ] Enable gzip compression (already in Express via `compression` middleware)
- [ ] Set proper cache headers for static assets
- [ ] Use CDN for static files (Cloudflare free tier works great)
- [ ] Enable HTTP/2
- [ ] Minify and chunk the build (Vite handles this automatically)
- [ ] Database backups (SQLite → pg_dump for PostgreSQL)

---

## Upgrading to PostgreSQL (Production Scale)

Replace SQLite with PostgreSQL for production:

1. Install pg: `npm install pg`
2. Update `src/models/db.js` to use `pg` pool
3. Run migrations
4. Update `DATABASE_URL` env var

---

## Monitoring

```bash
# View logs
pm2 logs krelixir-api

# Monitor resources
pm2 monit

# Check status
pm2 status
```
