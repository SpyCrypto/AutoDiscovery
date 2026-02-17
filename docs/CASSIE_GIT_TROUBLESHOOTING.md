# Git Troubleshooting — For Cassie on Chuck

If you're having trouble fetching or seeing files (especially media images), try these steps in order.

---

## 1. Check Your Remote

```bash
git remote -v
```

You should see `origin` pointing to `git@github.com:SpyCrypto/AutoDiscovery.git`. If it's pointing somewhere else, fix it:

```bash
git remote set-url origin git@github.com:SpyCrypto/AutoDiscovery.git
```

## 2. Check Your Branch

```bash
git branch
```

You should be on `main`. If not:

```bash
git checkout main
```

## 3. Check if Your Clone is Shallow

A shallow clone only has partial history and can cause missing files or merge failures.

```bash
git rev-parse --is-shallow-repository
```

- If it says **`true`**, unshallow it:

```bash
git fetch --unshallow origin
git pull origin main
```

- If it says **`false`**, your clone is fine — skip to step 4.

## 4. Pull Latest Changes

```bash
git fetch origin
git pull origin main
```

If you get merge conflicts or divergent branch errors, try:

```bash
git pull origin main --no-rebase --no-edit
```

## 5. Nuclear Option (If Nothing Else Works)

If all else fails, re-clone fresh:

```bash
cd /home/js
mv utils_AutoDiscovery_legal utils_AutoDiscovery_legal.bak
git clone git@github.com:SpyCrypto/AutoDiscovery.git utils_AutoDiscovery_legal
```

This gives you a clean copy. You can compare with the `.bak` folder for any local-only changes you want to keep.

## 6. Verify Media Files Are Present

After pulling, confirm the media files exist:

```bash
ls -la media/
```

You should see:
- `ADL elephant 2.png`
- `ADL elephant 3.png`
- `autodiscovery-banner.png`
- `autodiscovery-logo.png`
- `elephant-sanctions.png`
- `pink elephant.png`

---

*Left by Penny 🎀 — Feb 17, 2026*
