# SSH Connection - Next Steps

## Issue Encountered

SSH connection to `192.168.1.50` timed out.

---

## Likely Causes

1. **Server is offline or unreachable**
   - IP address might be incorrect
   - Server might not be running

2. **Network connectivity issue**
   - Firewall blocking SSH port 22
   - VPN not connected
   - Network routing issue

3. **SSH key issue**
   - Public key not in `authorized_keys` on server
   - Wrong key file path
   - Wrong permissions on key file

4. **SSH service not running**
   - SSH daemon not started on server
   - SSH port changed from default 22

---

## Quick Verification Steps

### Step 1: Check if server is reachable

```bash
ping 192.168.1.50
```

- If **PING works** → Server is online
- If **PING fails** → Server is offline or IP is wrong

### Step 2: Check SSH key exists

```bash
ls -la ~/.ssh/deploy_staging
```

Should show:
```
-rw------- user group deploy_staging
```

### Step 3: Test SSH with verbose output

```bash
ssh -vvv -i ~/.ssh/deploy_staging deploy@192.168.1.50
```

This will show exactly where the connection fails.

---

## What You Should Do

**Please answer these questions:**

1. ✅ Is `192.168.1.50` the correct IP address?
2. ✅ Can you `ping 192.168.1.50` from your machine?
3. ✅ Is the server online and running?
4. ✅ Did you add the SSH public key to the server's `~/.ssh/authorized_keys`?
5. ✅ Is the SSH username definitely `deploy`?

---

## Once SSH Works

When you can successfully SSH to the server:

```bash
ssh -i ~/.ssh/deploy_staging deploy@192.168.1.50
```

Run these commands:

```bash
# Create deployment directory
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery

# Verify Docker is installed
docker --version

# Verify Docker registry access
docker login ghcr.io -u <your-github-username> -p <your-token>
```

---

## For Production Server

Repeat the exact same process for your production server at the appropriate IP/hostname.

---

## GitHub Actions Will Handle the Rest

Once both servers are set up with `/opt/autodiscovery` directory and Docker registry login:

✅ GitHub Actions will automatically SSH and deploy
✅ New Docker images will be pulled
✅ Containers will be started
✅ Health checks will verify
✅ Slack will notify

---

**See**: `SSH_TROUBLESHOOTING.md` for detailed troubleshooting guide.

Let me know once SSH connection works! 🚀
