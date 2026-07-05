# SSH Connection Troubleshooting Guide

## Issue: SSH Connection Timeout or Failed

If you're seeing timeout errors when trying to SSH to your staging server, follow these steps:

---

## Check 1: Verify SSH Key Exists

```bash
# Check if the key file exists
ls -la ~/.ssh/deploy_staging

# Should output:
# -rw------- user user deploy_staging
```

If not found, the key might be in a different location. Try:
```bash
ls -la ~/.ssh/
```

---

## Check 2: Verify Server is Reachable

```bash
# Test connectivity
ping 192.168.1.50

# If ping fails, server is offline or unreachable
```

---

## Check 3: Verify SSH Access

```bash
# Test SSH connection with verbose output
ssh -vvv -i ~/.ssh/deploy_staging deploy@192.168.1.50

# This will show:
# - Connection attempts
# - Authentication method
# - Any errors or issues
```

---

## Check 4: Verify SSH Key is Authorized on Server

The SSH public key must be in `~/.ssh/authorized_keys` on the server.

**If you have direct server access:**

```bash
# On the server, check if key is authorized
cat ~/.ssh/authorized_keys | grep deploy_staging

# Should show the public key
```

**If you need to add the key:**

```bash
# From your local machine, copy the public key
cat ~/.ssh/deploy_staging.pub

# Then on the server (via console or other access):
echo "[paste the public key content here]" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

## Common Issues

### Issue 1: "Connection refused"
- SSH service not running on server
- SSH port blocked by firewall
- Server firewall rules

**Solution:**
```bash
# Ask your server admin to:
# 1. Verify SSH service is running
# 2. Check firewall allows port 22
# 3. Verify SSH key is in authorized_keys
```

### Issue 2: "Permission denied (publickey)"
- SSH key not authorized on server
- Wrong username (not `deploy`)
- Wrong key file

**Solution:**
```bash
# Verify correct user and key
ssh -i ~/.ssh/deploy_staging deploy@192.168.1.50

# If that fails, try root (if you have access)
ssh -i ~/.ssh/deploy_staging root@192.168.1.50

# Or verify key is on server
ssh -i ~/.ssh/deploy_staging deploy@192.168.1.50 \
  "cat ~/.ssh/authorized_keys"
```

### Issue 3: "Connection timed out"
- Server offline or IP is wrong
- Network connectivity issue
- Firewall blocking SSH

**Solution:**
```bash
# Verify server is running
ping 192.168.1.50

# If ping fails, server is unreachable
# Check with your infrastructure team

# If ping works but SSH doesn't, firewall might be blocking
```

---

## Verify Setup Complete

Once SSH works, run this to verify the staging server is ready:

```bash
# Create directory
ssh -i ~/.ssh/deploy_staging deploy@192.168.1.50 \
  "mkdir -p /opt/autodiscovery && ls -la /opt/"

# Test Docker
ssh -i ~/.ssh/deploy_staging deploy@192.168.1.50 \
  "docker --version"

# Test Docker registry login
ssh -i ~/.ssh/deploy_staging deploy@192.168.1.50 \
  "docker info | grep Username"
```

---

## Alternative: Direct Server Access

If SSH is having issues, you can:

1. **Use web console** (if cloud provider)
   - AWS EC2 → Connect → EC2 Instance Connect
   - DigitalOcean → Console
   - Linode → Lish

2. **Use server provider's terminal**
   - Directly access server via provider interface
   - Run setup commands there

3. **Manual setup**
   - SSH from your local machine using different method
   - Use VPN if network issue
   - Check firewall rules

---

## Next Steps

### If SSH Works:
```bash
ssh -i ~/.ssh/deploy_staging deploy@192.168.1.50

# Then run:
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery
docker --version
```

### If SSH Fails:
1. Verify server is running and reachable
2. Check SSH key is in authorized_keys
3. Verify SSH service running on server
4. Check firewall allows port 22
5. Try connecting to correct user/IP

---

## Questions to Answer

To help troubleshoot, answer:

1. Is the server at `192.168.1.50` running?
2. Can you `ping 192.168.1.50`?
3. Is this a local network server or cloud provider?
4. Did you add the SSH public key to the server?
5. Is the SSH user definitely `deploy`?

---

Once SSH works, deployment is straightforward:

```bash
ssh -i ~/.ssh/deploy_staging deploy@192.168.1.50 \
  "mkdir -p /opt/autodiscovery && cd /opt/autodiscovery && docker --version"
```

This will:
1. ✅ Create `/opt/autodiscovery` directory
2. ✅ Verify Docker is installed
3. ✅ Server is ready for GitHub Actions deployment
