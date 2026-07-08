# SSH Connection Refused - Diagnostic Guide

## Error: "Connection refused" on 192.168.1.143

This means the SSH service is either:
- ❌ Not running on the server
- ❌ Not listening on port 22
- ❌ Blocked by firewall
- ❌ Server is offline

---

## Diagnostic Steps

### Step 1: Check if Server is Online

```bash
ping 192.168.1.143
```

**If PING succeeds** → Server is online, SSH service issue
**If PING fails** → Server is offline

---

### Step 2: Check if SSH Port is Open

```bash
# Test if port 22 is open
nc -zv 192.168.1.143 22

# Or using telnet
telnet 192.168.1.143 22
```

**If port 22 responds** → SSH service is running
**If port 22 is closed** → SSH service not running or blocked

---

### Step 3: Access Server via Alternative Method

Since SSH is not working, try one of these:

**Option A: Direct Console Access**
- If cloud provider (AWS, DigitalOcean, etc.):
  - Use their web console
  - SSH might be disabled by default

**Option B: Different SSH Port**
```bash
# SSH might be on a different port (e.g., 2222)
ssh -i ~/.ssh/deploy_staging -p 2222 deploy@192.168.1.143
```

**Option C: Different User**
```bash
# Try different usernames
ssh -i ~/.ssh/deploy_staging root@192.168.1.143
ssh -i ~/.ssh/deploy_staging ubuntu@192.168.1.143
ssh -i ~/.ssh/deploy_staging ec2-user@192.168.1.143
```

---

## What Needs to Be Done on the Server

**Someone needs to access the server and run:**

```bash
# Create deployment directory
mkdir -p /opt/autodiscovery

# Set permissions
chmod 755 /opt/autodiscovery

# Verify Docker is installed
docker --version

# Verify SSH service is running
sudo systemctl status ssh
# or
sudo service ssh status
```

---

## Manual Setup Without SSH

If SSH is permanently unavailable, you'll need to:

1. **Manual setup on server** (via console or other access):
   ```bash
   mkdir -p /opt/autodiscovery
   chmod 755 /opt/autodiscovery
   ```

2. **Copy files manually**:
   - Use SCP (once SSH is available)
   - Use web interface to upload files
   - Use FTP/SFTP
   - Git clone repository on server

3. **Configure Docker**:
   ```bash
   docker login ghcr.io -u <username> -p <token>
   ```

---

## Enable SSH on Server

If SSH is disabled, enable it:

```bash
# Start SSH service
sudo systemctl start ssh
sudo service ssh start

# Enable SSH on boot
sudo systemctl enable ssh
sudo update-rc.d ssh enable

# Check SSH is running
sudo systemctl status ssh
```

---

## Firewall Rules

Ensure firewall allows SSH:

```bash
# UFW (Ubuntu Firewall)
sudo ufw allow 22/tcp
sudo ufw enable

# iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

---

## Alternative: GitHub Actions Without Direct SSH

If you can't SSH to the server:

1. **Ask your infrastructure team to:**
   - Create `/opt/autodiscovery` directory
   - Add your SSH public key to `authorized_keys`
   - Ensure SSH service is running
   - Open port 22 in firewall

2. **Or provide server console access** so you can set it up directly

3. **Or use GitHub Actions with a deployment key** if available

---

## Questions to Answer

1. Is `192.168.1.143` a:
   - Local network server?
   - Cloud provider instance (AWS, DigitalOcean, etc.)?
   - Virtual machine?

2. Do you have **direct access** to the server?
   - Console access?
   - Remote desktop?
   - Other access method?

3. What **operating system** is on the server?
   - Ubuntu?
   - CentOS?
   - Debian?
   - Other?

4. **Who manages** the server?
   - You?
   - Your team?
   - IT department?

---

## Next Action

**You need to:**

1. ✅ Verify server is online: `ping 192.168.1.143`
2. ✅ Access the server somehow (console, VPN, etc.)
3. ✅ Create `/opt/autodiscovery` directory
4. ✅ Verify SSH is running: `sudo systemctl status ssh`
5. ✅ Ensure SSH public key is in `~/.ssh/authorized_keys`

Once these are done, SSH will work and GitHub Actions can deploy automatically.

---

## For GitHub Actions Deployment to Work

You MUST have:
- ✅ SSH access working to the server
- ✅ `/opt/autodiscovery` directory created
- ✅ Docker installed and running
- ✅ Docker registry login configured
- ✅ SSH public key in `authorized_keys`

---

**What's the status of your server? Is it:**
- Online and running?
- SSH service enabled?
- Do you have console/alternative access?
