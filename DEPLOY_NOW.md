# 🚀 Deploy TinyLink to Vercel

Your git repository is ready! Follow these steps to deploy.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name your repository: `tinylink` (or any name you prefer)
3. **Important**: Do NOT initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, run these commands in your terminal:

```powershell
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tinylink.git

# Push your code
git branch -M main
git push -u origin main
```

If you see an authentication prompt, you may need to:
- Use a Personal Access Token instead of password
- Or install GitHub CLI: `winget install --id GitHub.cli`

## Step 3: Set Up PostgreSQL Database (Neon - Free)

1. Go to https://console.neon.tech/signup
2. Create a free account
3. Click "Create a project"
4. Copy the connection string (starts with `postgresql://`)
   - It looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/signup
2. Sign up with your GitHub account
3. Click "Add New" → "Project"
4. Import your `tinylink` repository
5. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: Leave default
   - **Environment Variables**: Add these two:

   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

   (Replace with your actual Neon connection string and Vercel URL - you'll get the Vercel URL after first deploy, then update it)

6. Click "Deploy"
7. Wait 2-3 minutes for deployment

### Option B: Via Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
cd d:\tiny-url
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name? tinylink
# - Which directory? ./
# - Override settings? No

# After first deploy, add environment variables:
vercel env add DATABASE_URL
# Paste your Neon connection string

vercel env add NEXT_PUBLIC_BASE_URL
# Paste your Vercel URL (e.g., https://tinylink-abc123.vercel.app)

# Redeploy with env vars
vercel --prod
```

## Step 5: Run Database Migration

After your first deployment, you need to set up the database schema:

### Option 1: Local Migration (Recommended)

```powershell
# Update your local .env with Neon connection string
# DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Generate migration
npx prisma migrate dev --name init

# Or just push schema (for development)
npx prisma db push
```

### Option 2: Via Vercel CLI

```powershell
# Connect to production and run migration
vercel env pull .env.production
npx prisma migrate deploy
```

## Step 6: Update NEXT_PUBLIC_BASE_URL

After your first deployment:

1. Copy your Vercel URL (e.g., `https://tinylink-abc123.vercel.app`)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Update `NEXT_PUBLIC_BASE_URL` to your actual Vercel URL
4. Redeploy (Vercel will auto-redeploy, or click "Redeploy" button)

## Step 7: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Create a test link:
   - Target URL: `https://google.com`
   - Custom code: `test`
3. Test the redirect: `https://your-app.vercel.app/test`
4. Should redirect to Google

## 🎉 You're Live!

Your short URL format: `https://your-app.vercel.app/{code}`

### Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `link.yourdomain.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_BASE_URL` to your custom domain
5. Redeploy

---

## Troubleshooting

### "Prisma Client not generated"
```powershell
vercel env pull
npx prisma generate
git add .
git commit -m "Add Prisma client"
git push
```

### "Can't reach database"
- Verify `DATABASE_URL` in Vercel environment variables
- Check Neon dashboard - database should be active
- Ensure connection string includes `?sslmode=require`

### "404 on short links"
- Check that you ran `npx prisma db push` or `npx prisma migrate deploy`
- Verify links exist in database via Neon dashboard

### Need to see logs?
```powershell
vercel logs
```

---

## Quick Reference

**Local Development:**
```powershell
npm run dev
```

**Production Commands:**
```powershell
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
vercel logs              # View logs
vercel env ls            # List environment variables
```

**Database Commands:**
```powershell
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
npx prisma db push       # Push schema without migration
npx prisma generate      # Regenerate client
```
