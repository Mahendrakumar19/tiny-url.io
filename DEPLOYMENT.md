# Deployment Guide for TinyLink

## Quick Deployment to Vercel + Neon

### Step 1: Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Click "Create Project"
3. Choose a project name (e.g., "tinylink-db")
4. Select a region close to your users
5. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)

### Step 2: Prepare Your Code

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/tiny-url.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Add Environment Variables:
   - `DATABASE_URL`: Your Neon connection string
   - `NEXT_PUBLIC_BASE_URL`: Will be your Vercel URL (e.g., `https://your-app.vercel.app`)

6. Click "Deploy"

### Step 4: Run Database Migrations

After first deployment, you need to create the database tables:

Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel env pull .env.production
npx prisma migrate deploy
```

Option B: Using Prisma Data Platform
```bash
# After deployment, run this locally with production DB URL
DATABASE_URL="your-production-url" npx prisma db push
```

Option C: Automatic in build (already configured)
The build script includes `prisma generate`, but for first deployment you may need to manually push the schema using Prisma Studio or the CLI.

### Step 5: Update Base URL

1. After deployment, note your Vercel URL (e.g., `https://tiny-url-xyz.vercel.app`)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Update `NEXT_PUBLIC_BASE_URL` to your actual Vercel URL
4. Redeploy (Vercel will auto-redeploy on git push)

### Step 6: Test Your Deployment

1. Visit `/healthz` endpoint: `https://your-app.vercel.app/healthz`
   - Should return `{"ok": true, "version": "1.0", ...}`

2. Test the dashboard: `https://your-app.vercel.app/`
   - Create a short link
   - Test the redirect
   - Check the stats page

## Alternative: Deploy to Render

### Database Setup (same as above)
Use Neon or Render's PostgreSQL service

### Deploy to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: tinylink
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   - `DATABASE_URL`: Your database connection string
   - `NEXT_PUBLIC_BASE_URL`: Your Render URL (e.g., `https://tinylink.onrender.com`)
   - `NODE_ENV`: production

6. Click "Create Web Service"

## Alternative: Deploy to Railway

### Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Next.js
5. Add Environment Variables:
   - `DATABASE_URL`: Your database connection string
   - `NEXT_PUBLIC_BASE_URL`: Your Railway URL

6. Optional: Add PostgreSQL to your project
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will auto-populate `DATABASE_URL`

## Environment Variables Reference

```env
# Required
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"

# Required for production
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# Optional
NODE_ENV="production"
```

## Post-Deployment Checklist

- [ ] `/healthz` returns 200 OK
- [ ] Dashboard loads at `/`
- [ ] Can create a link with custom code
- [ ] Can create a link with auto-generated code
- [ ] Redirect works: `/:code` → target URL
- [ ] Click count increments on redirect
- [ ] Stats page works: `/code/:code`
- [ ] Can delete links
- [ ] After deletion, redirect returns 404
- [ ] Search/filter works on dashboard
- [ ] Responsive design works on mobile
- [ ] Copy to clipboard works

## Troubleshooting

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check if database allows connections from your host
- For Neon, ensure you're using the correct connection string format

### Build Fails
- Check if `prisma generate` runs successfully
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Redirects Don't Work
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check if links exist in database
- Look at server logs for errors

### Environment Variables Not Working
- Redeploy after adding/changing env vars
- For `NEXT_PUBLIC_*` vars, rebuild is required
- Check if vars are exposed correctly in logs

## Monitoring

### Vercel
- View logs: Dashboard → Your Project → Deployments → [deployment] → Logs
- Monitor performance: Dashboard → Analytics

### Render
- View logs: Dashboard → Your Service → Logs
- Monitor metrics: Dashboard → Metrics

### Railway
- View logs: Dashboard → Your Service → Logs
- Monitor deployments: Dashboard → Deployments

## Updating Your Deployment

1. Make changes to your code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```
3. Vercel/Render/Railway will automatically detect and redeploy

## Database Migrations

When you change the Prisma schema:

1. Create migration locally:
```bash
npx prisma migrate dev --name your_migration_name
```

2. Commit migration files:
```bash
git add prisma/migrations
git commit -m "Add migration: your_migration_name"
git push
```

3. Apply to production:
```bash
# Option 1: Add to build command in Vercel/Render
npm run build && npx prisma migrate deploy

# Option 2: Run manually
DATABASE_URL="production-url" npx prisma migrate deploy
```

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` to your custom domain

### Render/Railway
Similar process in their respective dashboards

## Backup Strategy

### Database Backups
- **Neon**: Automatic backups included
- **Render PostgreSQL**: Automatic backups on paid plans
- **Railway**: Automatic backups included

### Manual Backup
```bash
# Export all data
npx prisma studio
# or
pg_dump $DATABASE_URL > backup.sql
```

## Scaling Considerations

- **Vercel**: Scales automatically
- **Database**: Upgrade Neon plan as needed
- **Caching**: Consider adding Redis for popular links
- **Analytics**: Add proper analytics service for production

## Security Checklist

- [ ] Environment variables are not committed to git
- [ ] `.env` is in `.gitignore`
- [ ] Database credentials are secure
- [ ] HTTPS is enabled (automatic on Vercel/Render/Railway)
- [ ] Input validation is working
- [ ] SQL injection protection (Prisma handles this)
- [ ] Rate limiting (consider adding for production)

## Support

For issues:
1. Check application logs
2. Verify environment variables
3. Test locally with production DB
4. Check Prisma/Next.js documentation
5. Review error messages in deployment platform

## Success! 🎉

Your TinyLink app should now be live and accessible at your deployment URL!
