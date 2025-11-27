# 🔧 Quick Fix - Add DATABASE_URL to Vercel

## Copy this connection string:
```
postgresql://neondb_owner:npg_LGY5IDiZ2kOB@ep-billowing-dust-ahlq07r1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Steps:
1. Go to: https://vercel.com/mahendrakumar19s-projects/tiny-url-io/settings/environment-variables
2. Click "Add New"
3. Name: `DATABASE_URL`
4. Value: Paste the connection string above
5. Environment: Select all (Production, Preview, Development)
6. Click "Save"

## Then redeploy:
```powershell
vercel --prod
```

Your app will work immediately after this!
