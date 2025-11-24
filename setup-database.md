# 🚀 Quick Database Setup

Your app shows "Failed to create link" because Vercel needs a PostgreSQL database.

## ⚡ 2-Minute Fix:

### 1. Get Free PostgreSQL (Neon)
Open: https://console.neon.tech/signup

- Sign up with GitHub (30 seconds)
- Click "Create Project"
- Copy connection string that looks like:
  ```
  postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
  ```

### 2. Add to Vercel (2 ways)

**Option A: Via Command Line (Fastest)**
```powershell
# Run these in your terminal:
vercel env add DATABASE_URL production
# Paste your Neon connection string when prompted

vercel env add NEXT_PUBLIC_BASE_URL production  
# Enter: https://tiny-url-io.vercel.app

# Setup database tables
npx prisma generate
npx prisma db push

# Deploy with new env vars
vercel --prod
```

**Option B: Via Dashboard**
1. Go to: https://vercel.com/mahendrakumar19s-projects/tiny-url-io/settings/environment-variables
2. Add two variables:
   - `DATABASE_URL` = your Neon connection string
   - `NEXT_PUBLIC_BASE_URL` = `https://tiny-url-io.vercel.app`
3. Click "Redeploy" button in Deployments tab

### 3. Setup Database Schema
```powershell
# In your terminal (d:\tiny-url):
npx prisma db push
```

### 4. Test It
Visit: https://tiny-url-io.vercel.app
Try creating a link - it should work now!

---

## 🔍 Verify It's Working

```powershell
# Check logs after adding database:
vercel logs --follow
```

You should NOT see "Environment variable not found: DATABASE_URL" errors anymore.

---

## ❓ Need Help?

If you're stuck, paste your Neon connection string and I'll help configure everything!
