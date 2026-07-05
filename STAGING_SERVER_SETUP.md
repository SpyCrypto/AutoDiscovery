# Staging Server Setup - Complete Guide

## Step 1: SSH to Staging Server ✅

```bash
ssh deploy@your-staging-server.com
```

Replace `your-staging-server.com` with your actual staging server address (hostname or IP).

**Example:**
```bash
ssh deploy@staging.example.com
# or
ssh deploy@192.168.1.50
```

---

## Step 2: Create Deployment Directory ✅

```bash
mkdir -p /opt/autodiscovery
```

This creates the directory with parent directories if needed.

**Verify it was created:**
```bash
ls -la /opt/ | grep autodiscovery
```

---

## Step 3: Navigate to Directory ✅

```bash
cd /opt/autodiscovery
```

**Verify you're in the right place:**
```bash
pwd
# Output: /opt/autodiscovery
```

---

## Step 4: Copy Configuration Files (From Your Local Machine)

**Open a NEW terminal on your local machine** (don't close the SSH session):

```bash
# Copy docker-compose production config
scp docker-compose.prod.yml deploy@your-staging-server.com:/opt/autodiscovery/

# Copy docker-compose preview config
scp docker-compose.preview.yml deploy@your-staging-server.com:/opt/autodiscovery/

# Copy environment file
scp .env.production deploy@your-staging-server.com:/opt/autodiscovery/.env
```

**Verify files were copied** (back in your SSH session):

```bash
ls -la /opt/autodiscovery/
```

Expected output:
```
-rw-r--r-- docker-compose.prod.yml
-rw-r--r-- docker-compose.preview.yml
-rw-r--r-- .env
```

---

## Step 5: Configure Docker Registry Login

**Still in your SSH session:**

```bash
# Login to GitHub Container Registry
docker login ghcr.io -u <your-github-username> -p <your-github-token>
```

Replace:
- `<your-github-username>` with your GitHub username
- `<your-github-token>` with your GitHub personal access token

**Verify login succeeded:**
```bash
docker pull ghcr.io/spycrypto/autodiscovery-preview:latest
```

---

## Step 6: Test Initial Deployment (Optional)

```bash
cd /opt/autodiscovery

# Start containers
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Test health
curl http://localhost/health
```

---

## Step 7: Set Proper Permissions

```bash
# Ensure deploy user owns the directory
chmod 755 /opt/autodiscovery

# Ensure logs and data directories are writable
chmod 755 /opt/autodiscovery/logs
chmod 755 /opt/autodiscovery/data
```

---

## Complete Setup Checklist

On your staging server, verify:

```bash
# 1. Directory exists
ls -la /opt/autodiscovery/
# Should show: docker-compose.prod.yml, docker-compose.preview.yml, .env

# 2. Docker is running
docker --version

# 3. Docker registry login works
docker info | grep Username

# 4. Network connectivity
ping preprod-node.midnight.network

# 5. Required ports are available
netstat -tlnp | grep 5173  # Frontend
netstat -tlnp | grep 6379  # Redis
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `ssh deploy@your-server.com` | Connect to server |
| `mkdir -p /opt/autodiscovery` | Create directory |
| `cd /opt/autodiscovery` | Navigate to directory |
| `ls -la` | List files |
| `docker-compose -f docker-compose.prod.yml up -d` | Start services |
| `docker-compose -f docker-compose.prod.yml ps` | Check status |
| `docker-compose -f docker-compose.prod.yml logs -f` | View logs |
| `docker-compose -f docker-compose.prod.yml down` | Stop services |

---

## Troubleshooting

### Cannot SSH to server
```bash
# Check SSH connectivity
ssh -v deploy@your-staging-server.com

# Verify SSH key is added to authorized_keys
ssh deploy@your-staging-server.com "cat ~/.ssh/authorized_keys | grep deploy_staging"
```

### Cannot access /opt/autodiscovery
```bash
# Check permissions
ls -la /opt/

# Check if directory exists
test -d /opt/autodiscovery && echo "exists" || echo "not found"

# Verify deploy user owns it
stat /opt/autodiscovery
```

### Docker not found
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add deploy user to docker group
sudo usermod -aG docker deploy
```

---

## Next: GitHub Actions Deployment

Once this is set up, GitHub Actions will automatically:

1. ✅ SSH to `deploy@your-staging-server.com`
2. ✅ `cd /opt/autodiscovery`
3. ✅ Pull latest Docker image
4. ✅ Run `docker-compose up -d`
5. ✅ Verify health checks
6. ✅ Send Slack notification

---

## For Production Server

Repeat the exact same steps for production:

```bash
ssh deploy@your-prod-server.com
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery
# ... same setup as staging
```

---

**Once complete, your staging server is ready for automated deployments!** 🚀

GitHub Actions will handle the rest automatically on every `git push origin develop`.
