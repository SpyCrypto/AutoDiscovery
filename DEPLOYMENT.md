# AutoDiscovery Production Deployment Guide

## Overview

AutoDiscovery is a Midnight-based decentralized application (dapp) with a monorepo structure containing:
- **CLI** - Command-line interface for dapp interactions
- **Contract** - Smart contracts compiled from Compact language
- **Frontend - RealDeal** - Main production UI for discovery management
- **Frontend - Demoland** - Demo/testing UI

## Pre-Deployment Checklist

### 1. Contract Deployment
Before deploying frontends or CLI, deploy all 6 Midnight contracts to PreProd:

```bash
# Compile all contracts
npm run compact

# Deploy to PreProd (requires Midnight wallet setup)
cd autodiscovery-contract
npx tsx src/deploy_preprod.ts
```

**Save all 6 contract addresses** from deployment output:
- `DISCOVERY_CORE`
- `DISCOVERY_PROOF`
- `DOCUMENT_REGISTRY`
- `ACCESS_CONTROL`
- `JURISDICTION_REGISTRY`
- `EXPERT_WITNESS`

### 2. Environment Configuration

Copy `.env.production` template and populate:

```bash
cp .env.production .env.prod
```

Edit `.env.prod` and fill in:
- All 6 contract addresses from Step 1
- PreProd endpoint URLs (from Midnight network documentation)

Example:
```env
VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_INDEXER_WS=wss://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network

VITE_CONTRACT_DISCOVERY_CORE=02fb41f89384c...
VITE_CONTRACT_DISCOVERY_PROOF=03cc52g89494d...
# ... etc
```

### 3. Wallet SDK Alignment

Ensure all wallet SDK packages use the same major version:

```bash
cd frontend-realdeal && npm install
cd ../frontend-demoland && npm install
```

This is already done in the updated `package.json` files.

## Deployment Methods

### Method 1: Docker Compose (Recommended for All Environments)

#### Prerequisites
- Docker & Docker Compose installed
- `.env.prod` file configured

#### Single Command Deploy
```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

**Services running:**
- CLI on port 8080
- RealDeal Frontend on port 5174
- Demoland Frontend on port 5173

#### Health Checks
```bash
# CLI health
curl http://localhost:8080/health

# Frontend health
curl http://localhost:5174/health
curl http://localhost:5173/health
```

### Method 2: Kubernetes (Production Grade)

#### Generate manifests from Dockerfiles

```bash
# Build all images first
docker build -t autodiscovery-cli:prod -f Dockerfile.cli .
docker build -t autodiscovery-frontend-realdeal:prod -f Dockerfile.frontend-realdeal .
docker build -t autodiscovery-frontend-demoland:prod -f Dockerfile.frontend-demoland .

# Push to registry
docker tag autodiscovery-cli:prod <your-registry>/autodiscovery-cli:latest
docker push <your-registry>/autodiscovery-cli:latest
# ... repeat for other images
```

#### Create Kubernetes manifests

```yaml
# cli-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: autodiscovery-cli
  labels:
    app: autodiscovery
spec:
  replicas: 2
  selector:
    matchLabels:
      app: autodiscovery-cli
  template:
    metadata:
      labels:
        app: autodiscovery-cli
    spec:
      containers:
      - name: cli
        image: <your-registry>/autodiscovery-cli:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: CLI_ENV
          value: "preprod"
        envFrom:
        - configMapRef:
            name: autodiscovery-config
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: autodiscovery-cli-service
spec:
  selector:
    app: autodiscovery-cli
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f cli-deployment.yaml
kubectl apply -f frontend-realdeal-deployment.yaml
kubectl apply -f frontend-demoland-deployment.yaml
```

### Method 3: Manual Build & Run

#### Build
```bash
npm ci
npm run build
npm run build-production

# Contract must be built first
npm run compact
cd autodiscovery-contract && npm run build
```

#### Run Each Service Separately
```bash
# Terminal 1 - CLI
cd autodiscovery-cli
npm run deploy-preprod

# Terminal 2 - Frontend (RealDeal)
cd frontend-realdeal
npm run build
npm run preview  # or use a production server like `serve`

# Terminal 3 - Frontend (Demoland)
cd frontend-demoland
npm run build
npm run preview
```

## Post-Deployment Verification

### 1. Service Availability
```bash
# Check each endpoint responds
curl -v http://localhost:8080/health
curl -v http://localhost:5174/health
curl -v http://localhost:5173/health
```

### 2. Contract Integration
Log into RealDeal frontend and verify:
- Can read jurisdiction registry ✓
- Can read case list ✓
- Can view documents ✓
- Wallet connection works ✓

### 3. Transaction Testing
Create a test case through UI and verify:
- Transaction submitted successfully
- Appears in contract state within 1-2 blocks
- Off-chain indexer updates within 5 seconds

### 4. Performance Monitoring
```bash
# Monitor container resource usage
docker stats

# Check logs for errors
docker-compose -f docker-compose.prod.yml logs --tail=50 cli
docker-compose -f docker-compose.prod.yml logs --tail=50 frontend-realdeal
```

## Troubleshooting

### Issue: "Contract not found" errors in frontend

**Cause:** Contract addresses in `.env.prod` don't match deployment.

**Fix:**
1. Verify contract addresses in `.env.prod` are correct
2. Verify contracts were deployed successfully
3. Restart containers: `docker-compose -f docker-compose.prod.yml restart`

### Issue: "Proof server unreachable"

**Cause:** `VITE_PROOF_SERVER_URL` incorrect or server offline.

**Fix:**
1. Check `.env.prod` proof server URL
2. Verify network connectivity: `curl -v ${VITE_PROOF_SERVER_URL}/health`
3. Check Midnight network status

### Issue: Wallet won't connect

**Cause:** Wallet SDK version mismatch or missing SDK packages.

**Fix:**
1. Verify all `@midnight-ntwrk/*` packages are version `^3.2.0`
2. Clear browser cache and local storage
3. Restart frontend: `docker-compose -f docker-compose.prod.yml restart frontend-realdeal`

### Issue: High memory usage

**Cause:** Node.js heap size limit reached.

**Fix:**
1. Increase heap in Dockerfile or docker-compose:
   ```bash
   environment:
     - NODE_OPTIONS=--max-old-space-size=1024
   ```
2. Monitor with: `docker stats <container>`

## Scaling & Performance

### Horizontal Scaling (Multi-Container)
```bash
# Scale CLI to 3 replicas
docker-compose -f docker-compose.prod.yml up -d --scale cli=3
```

### Load Balancer Setup
Place nginx or HAProxy in front with round-robin:
```nginx
upstream autodiscovery-cli {
    server cli:8080;
    server cli:8081;
    server cli:8082;
}

server {
    listen 80;
    location / {
        proxy_pass http://autodiscovery-cli;
    }
}
```

### CDN for Frontend Assets
- Serve static assets from CDN (CloudFront, Cloudflare, etc.)
- Cache `.js`, `.css`, `.wasm` files for 1 year
- Serve `index.html` with no-cache

## Security Best Practices

1. **Never commit `.env` files with real values** - use `.env.production.example`
2. **Use secrets management** - Kubernetes Secrets, GitHub Actions Secrets, etc.
3. **Enable HTTPS** - Use Let's Encrypt + nginx/HAProxy reverse proxy
4. **Network isolation** - Keep internal services on private networks
5. **Regular updates** - `npm audit fix`, update base images monthly
6. **Access logs** - Monitor logs for suspicious activity

## Monitoring & Logging

### Collect Logs
```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml logs --tail=1000 > logs.txt

# Kubernetes
kubectl logs deployment/autodiscovery-cli > cli-logs.txt
```

### Set Up Log Aggregation (ELK/Loki)
```yaml
# In docker-compose.prod.yml
logging:
  driver: "awslogs"
  options:
    awslogs-group: "/ecs/autodiscovery"
    awslogs-region: "us-east-1"
```

## Rollback Procedure

### Docker Compose
```bash
# Restore previous image
docker-compose -f docker-compose.prod.yml down
git checkout docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes
```bash
# Rollback to previous deployment
kubectl rollout history deployment/autodiscovery-cli
kubectl rollout undo deployment/autodiscovery-cli --to-revision=1
```

## Support & Issues

- **Issues:** https://github.com/SpyCrypto/AutoDiscovery/issues
- **Docs:** See `.md` files in `/docs`
- **Contract audit:** See `PREPROD-REVIEW.md` for critical blockers

---

**Last Updated:** 2026-05-13
