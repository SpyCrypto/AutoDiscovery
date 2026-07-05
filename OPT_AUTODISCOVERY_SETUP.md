# /opt/autodiscovery - Deployment Directory Setup

## Overview

`/opt/autodiscovery` is the directory on your **staging and production servers** where AutoDiscovery containers run and are managed.

---

## Directory Structure

```
/opt/autodiscovery/
├── docker-compose.prod.yml        # Production compose config
├── docker-compose.preview.yml      # Preview/staging config
├── .env                            # Environment variables
├── logs/                           # Container logs
│   ├── frontend/
│   ├── redis/
│   └── cli/
└── data/                           # Persistent data
    ├── redis/
    └── postgres/
```

---

## What Should Be In `/opt/autodiscovery`

### Required Files

1. **docker-compose.prod.yml**
   - Production Docker Compose configuration
   - Defines all services (frontend, Redis, CLI, etc.)
   - Environment variables and volume mounts

2. **docker-compose.preview.yml**
   - Preview/staging configuration
   - Simplified version for testing

3. **.env** (or .env.production)
   - Environment variables for services
   - Contract addresses
   - Midnight network endpoints
   - Port mappings

### Auto-Created Directories

The following are created automatically when containers run:
- `logs/` - Container output logs
- `data/` - Persistent volumes (Redis, Postgres)

---

## Setup Instructions

### 1. On Your Server (SSH as deploy user or root)

```bash
# Create the directory
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery

# Clone or copy the repository
git clone https://github.com/SpyCrypto/AutoDiscovery.git .
# OR copy docker-compose files manually

# Set permissions
chmod 755 /opt/autodiscovery
```

### 2. Copy Required Files

```bash
# From your local machine or git
scp docker-compose.prod.yml deploy@your-server:/opt/autodiscovery/
scp docker-compose.preview.yml deploy@your-server:/opt/autodiscovery/
scp .env.production deploy@your-server:/opt/autodiscovery/.env
```

### 3. Setup Docker Registry Login

```bash
# On the server
docker login ghcr.io -u <github-username> -p <github-token>
```

---

## Environment File (.env)

Create `/opt/autodiscovery/.env` with:

```env
# Midnight Network
VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_INDEXER_WS=wss://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network

# Contract Addresses (after deployment)
VITE_CONTRACT_DISCOVERY_CORE=<address>
VITE_CONTRACT_DISCOVERY_PROOF=<address>
# ... etc for all contracts

# App Mode
VITE_APP_MODE=realdeal
NODE_ENV=production

# Ports
FRONTEND_PORT=5173
REDIS_PORT=6379
CLI_PORT=8080
```

---

## Running Containers

### Start Services

```bash
cd /opt/autodiscovery

# Start with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Or for staging
docker-compose -f docker-compose.preview.yml up -d
```

### View Logs

```bash
cd /opt/autodiscovery

# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f redis
```

### Stop Services

```bash
cd /opt/autodiscovery

docker-compose -f docker-compose.prod.yml down
```

### Restart Services

```bash
cd /opt/autodiscovery

docker-compose -f docker-compose.prod.yml restart
```

---

## Deployment via SSH (Automated)

Your GitHub Actions `deploy.yml` automatically:

1. SSH to `/opt/autodiscovery`
2. Pulls latest Docker image from GHCR
3. Runs `docker-compose down` (stop old containers)
4. Runs `docker-compose -f docker-compose.prod.yml up -d` (start new)
5. Verifies health check
6. Sends Slack notification

---

## Directory Permissions

```bash
# Proper permissions
chmod 755 /opt/autodiscovery
chmod 644 /opt/autodiscovery/.env
chmod 755 /opt/autodiscovery/logs
chmod 755 /opt/autodiscovery/data
```

---

## Persistent Volumes

Data stored in `/opt/autodiscovery/data/`:

| Volume | Purpose | Survives Restart |
|--------|---------|------------------|
| redis/ | Redis cache data | ✅ Yes |
| postgres/ | Database | ✅ Yes |

Set ownership:
```bash
chown -R 1000:1000 /opt/autodiscovery/data
```

---

## Troubleshooting

### Check if container is running
```bash
cd /opt/autodiscovery
docker-compose -f docker-compose.prod.yml ps
```

### View container status
```bash
docker ps -a
```

### Check logs for errors
```bash
cd /opt/autodiscovery
docker-compose -f docker-compose.prod.yml logs
```

### Verify health
```bash
curl http://localhost/health
```

---

## SSH Deployment Integration

Your GitHub Actions automatically manages this directory:

1. ✅ SSH to server
2. ✅ `cd /opt/autodiscovery`
3. ✅ Pulls latest image from GHCR
4. ✅ Updates `docker-compose.prod.yml` if needed
5. ✅ Runs deployment commands
6. ✅ Verifies with health checks

---

## Required SSH Access

For deployment to work, ensure:

✅ SSH key is deployed to `/home/deploy/.ssh/authorized_keys`
✅ Directory `/opt/autodiscovery` exists and is writable
✅ Docker is installed and running
✅ `docker login ghcr.io` successful
✅ Network access to GitHub Container Registry

---

## Monitoring

Monitor your `/opt/autodiscovery` deployment:

```bash
# Watch services in real-time
watch docker-compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats

# View recent logs
docker-compose -f docker-compose.prod.yml logs --tail 100
```

---

## Backup

Backup your persistent data:

```bash
tar -czf autodiscovery-backup-$(date +%Y%m%d).tar.gz \
  /opt/autodiscovery/data/ \
  /opt/autodiscovery/.env
```

---

## Summary

`/opt/autodiscovery` is your deployment directory containing:
- ✅ Docker Compose configurations
- ✅ Environment variables
- ✅ Running containers
- ✅ Persistent data (logs, databases)
- ✅ Application state

Managed automatically by GitHub Actions on push/deployment! 🚀
