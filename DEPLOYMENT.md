# TeamFlow Deployment Guide

Comprehensive deployment instructions for the TeamFlow collaborative workspace management application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Local Development](#local-development)
5. [Production Deployment](#production-deployment)
6. [Security Checklist](#security-checklist)
7. [Troubleshooting](#troubleshooting)
8. [Monitoring and Health Checks](#monitoring-and-health-checks)

## 🔧 Prerequisites

Before deploying TeamFlow, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or **pnpm**/**yarn**)
- **PostgreSQL**: v14.0 or higher
- **Git**: Latest version

### Recommended Tools

- **VS Code** with ESLint and Prettier extensions
- **Docker** (optional, for containerized deployment)
- **Vercel CLI** or **Railway CLI** (for cloud deployment)

## 🌍 Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SmartBulldog/TeamFlow.git
cd TeamFlow
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` and update with your values:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/teamflow"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate a secure NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

## 🗄️ Database Setup

### Local PostgreSQL Setup

#### Option 1: Native PostgreSQL

1. **Install PostgreSQL:**
   - **macOS**: `brew install postgresql@14`
   - **Ubuntu**: `sudo apt-get install postgresql-14`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Create Database:**

```bash
psql postgres
CREATE DATABASE teamflow;
CREATE USER teamflow_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE teamflow TO teamflow_user;
\q
```

3. **Update `.env` with connection string:**

```env
DATABASE_URL="postgresql://teamflow_user:your_password@localhost:5432/teamflow"
```

#### Option 2: Docker

```bash
docker run --name teamflow-postgres \
  -e POSTGRES_DB=teamflow \
  -e POSTGRES_USER=teamflow_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14-alpine
```

### Run Database Migrations

```bash
npx prisma generate
npx prisma db push
```

### Seed Database (Optional)

```bash
npx prisma db seed
```

## 💻 Local Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Development Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run Prisma Studio (database GUI)
npx prisma studio

# Database migrations
npx prisma migrate dev
npx prisma migrate deploy
```

## 🚀 Production Deployment

### Deployment Platforms

TeamFlow can be deployed to various platforms. Below are recommended options:

#### 1. Vercel (Recommended)

**Advantages**: Seamless Next.js integration, automatic deployments, edge functions.

**Steps:**

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Login and Deploy:**

```bash
vercel login
vercel
```

3. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Set `NEXTAUTH_URL` to your production domain

4. **Database**: Use managed PostgreSQL:
   - **Vercel Postgres**: Integrated solution
   - **Supabase**: Free tier available
   - **Railway**: Easy PostgreSQL setup
   - **Neon**: Serverless PostgreSQL

5. **Deploy:**

```bash
vercel --prod
```

#### 2. Railway

**Advantages**: Built-in PostgreSQL, simple pricing, excellent DX.

**Steps:**

1. **Create Railway Account**: [railway.app](https://railway.app)

2. **New Project from GitHub:**
   - Connect your repository
   - Railway auto-detects Next.js

3. **Add PostgreSQL:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL`

4. **Set Environment Variables:**
   - Go to Variables tab
   - Add all required variables

5. **Deploy:**
   - Automatic on every push to main branch

#### 3. Docker Deployment

**For VPS or self-hosted environments:**

**Create `Dockerfile`:**

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

**Build and Run:**

```bash
docker build -t teamflow .
docker run -p 3000:3000 --env-file .env teamflow
```

**Docker Compose** (`docker-compose.yml`):

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://teamflow_user:password@db:5432/teamflow
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: teamflow
      POSTGRES_USER: teamflow_user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

**Start with Docker Compose:**

```bash
docker-compose up -d
```

## 🔒 Security Checklist

Before deploying to production, ensure:

### Environment Variables

- ✅ `NEXTAUTH_SECRET` is a strong random string (not default)
- ✅ `DATABASE_URL` uses strong password
- ✅ `NEXTAUTH_URL` matches production domain (HTTPS)
- ✅ No sensitive data in `.env.example`

### Database

- ✅ Database has restricted network access
- ✅ Database backups are configured
- ✅ Connection pooling is enabled for production
- ✅ Database user has minimal required permissions

### Application Security

- ✅ HTTPS is enforced (via platform or reverse proxy)
- ✅ CSP headers are configured (already in middleware)
- ✅ Rate limiting is active (already implemented)
- ✅ CORS is properly configured
- ✅ Cookie consent banner is visible (GDPR compliance)

### Monitoring

- ✅ Error tracking configured (Sentry, LogRocket, etc.)
- ✅ Performance monitoring enabled
- ✅ Uptime monitoring active
- ✅ Database performance tracked

### Legal Compliance

- ✅ Privacy Policy is accessible
- ✅ Terms of Service are visible
- ✅ Cookie Policy is published
- ✅ GDPR requirements met (for EU users)

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error**: `Can't reach database server`

**Solution**:
- Check `DATABASE_URL` format
- Verify PostgreSQL is running: `pg_isready`
- Check firewall/network settings
- Ensure database exists: `psql -l`

#### 2. NextAuth Configuration Issues

**Error**: `[next-auth][error][NO_SECRET]`

**Solution**:
- Generate new secret: `openssl rand -base64 32`
- Set `NEXTAUTH_SECRET` in environment
- Restart application

#### 3. Build Errors

**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run build
```

#### 4. Prisma Migration Issues

**Error**: `Migration failed`

**Solution**:
```bash
# Reset database (⚠️ DESTROYS DATA)
npx prisma migrate reset

# Or manually apply migrations
npx prisma migrate deploy
```

#### 5. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find process using port 3000
lsof -ti:3000
# Kill process
kill -9 $(lsof -ti:3000)
```

### Performance Optimization

#### Database

- Enable connection pooling (Prisma Accelerate or PgBouncer)
- Add database indexes for frequently queried fields
- Use database caching (Redis)

#### Application

- Enable Next.js image optimization
- Use CDN for static assets
- Implement API response caching
- Monitor and optimize bundle size

### Logs and Debugging

```bash
# View application logs (local)
npm run dev

# View database queries (Prisma)
export DEBUG="prisma:query"
npm run dev

# Production logs (Vercel)
vercel logs

# Production logs (Railway)
railway logs
```


---

## 📊 Monitoring and Health Checks

### Health Check Endpoint

TeamFlow includes a comprehensive health check endpoint for monitoring application status:

**Endpoint:** `GET /api/health`

**Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "responseTime": "12ms"
  },
  "memory": {
    "used": 245,
    "total": 512,
    "unit": "MB"
  },
  "system": {
    "platform": "linux",
    "nodeVersion": "v20.10.0"
  }
}
```

**Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "environment": "production",
  "database": {
    "status": "disconnected",
    "error": "Connection timeout"
  },
  "memory": {
    "used": 490,
    "total": 512,
    "unit": "MB"
  }
}
```

### Monitoring Setup

#### 1. **Application Monitoring**

```bash
# Check application health
curl https://your-domain.com/api/health

# Monitor with interval
watch -n 30 'curl -s https://your-domain.com/api/health | jq .'
```

#### 2. **Database Monitoring**

Monitor PostgreSQL performance:

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('teamflow'));

-- Monitor slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

#### 3. **WebSocket Monitoring**

Monitor WebSocket connections:

```bash
# Check WebSocket service
netstat -an | grep :3001

# Monitor connection count
ss -tan | grep :3001 | wc -l
```

#### 4. **Log Monitoring**

**Application Logs:**
```bash
# View real-time logs
npm run logs

# Search for errors
grep -i error logs/app.log

# Monitor specific patterns
tail -f logs/app.log | grep "health check"
```

**Docker Logs:**
```bash
# View container logs
docker compose logs -f app

# View database logs
docker compose logs -f db

# View WebSocket service logs
docker compose logs -f websocket
```

### Alerting Setup

#### Uptime Monitoring Services

**Recommended Services:**
- **UptimeRobot** - Free tier available
- **Pingdom** - Comprehensive monitoring
- **StatusCake** - Global monitoring
- **Better Uptime** - Modern monitoring platform

**Setup Example (UptimeRobot):**

1. Create HTTP(S) monitor
2. URL: `https://your-domain.com/api/health`
3. Check interval: 5 minutes
4. Alert conditions:
   - HTTP status != 200
   - Response contains "unhealthy"
5. Notification channels: Email, Slack, SMS

#### Custom Alerting Script

```bash
#!/bin/bash
# health-check-alert.sh

HEALTH_URL="https://your-domain.com/api/health"
WEBHOOK_URL="your-slack-webhook-url"

response=$(curl -s $HEALTH_URL)
status=$(echo $response | jq -r '.status')

if [ "$status" != "healthy" ]; then
    curl -X POST $WEBHOOK_URL \
        -H 'Content-Type: application/json' \
        -d '{"text":"🚨 TeamFlow Health Check Failed!","attachments":[{"text":"'"$response"'"}]}'
fi
```

**Setup Cron Job:**
```bash
# Run health check every 5 minutes
*/5 * * * * /path/to/health-check-alert.sh
```

### Performance Metrics

#### Key Metrics to Monitor

1. **Response Time**
   - API endpoint response times
   - Database query performance
   - WebSocket message latency

2. **Resource Usage**
   - CPU utilization
   - Memory consumption
   - Disk I/O
   - Network bandwidth

3. **Application Metrics**
   - Active users/connections
   - Request rate
   - Error rate
   - Cache hit ratio

4. **Database Metrics**
   - Connection pool usage
   - Query execution time
   - Transaction rate
   - Lock contention

### Production Monitoring Tools

#### Recommended Stack

1. **Application Performance Monitoring (APM)**
   - New Relic
   - Datadog
   - AppDynamics

2. **Log Management**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Grafana Loki
   - Papertrail

3. **Infrastructure Monitoring**
   - Prometheus + Grafana
   - Netdata
   - Zabbix

4. **Error Tracking**
   - Sentry
   - Rollbar
   - Bugsnag

### Backup Monitoring

```bash
# Verify backup exists
test -f /backups/teamflow-$(date +%Y%m%d).sql && echo "Backup OK" || echo "Backup Missing"

# Check backup age
find /backups -name "teamflow-*.sql" -mtime -1 | wc -l

# Test backup restore (dry run)
pg_restore --list backup.sql > /dev/null 2>&1 && echo "Backup Valid" || echo "Backup Corrupted"
```

## 📞 Support

For deployment issues or questions:

- **GitHub Issues**: [github.com/SmartBulldog/TeamFlow/issues](https://github.com/SmartBulldog/TeamFlow/issues)
- **Email**: smartbulldog.pro@gmail.com
- **Author**: Valerii Karpov (VKV - New vision)
- **Project Homepage**: [teamflow.vkvstudio.pro](https://teamflow.vkvstudio.pro)

---

**License**: MIT  
**Version**: 0.1.0  
**Last Updated**: 2025
