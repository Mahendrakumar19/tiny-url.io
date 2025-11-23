# Quick Start Guide - TinyLink

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or Neon account)
- Git

## Setup Steps

### 1. Clone & Install (1 minute)

```bash
git clone <your-repo-url>
cd tiny-url
npm install
```

### 2. Database Setup (2 minutes)

#### Option A: Use Neon (Recommended for beginners)

1. Go to [neon.tech](https://neon.tech) and create free account
2. Create new project
3. Copy connection string

#### Option B: Local PostgreSQL

```bash
# Make sure PostgreSQL is running
# Create a database named 'tinylink'
createdb tinylink
```

### 3. Configure Environment (1 minute)

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env`:
```env
# For Neon
DATABASE_URL="postgresql://username:password@host/dbname"

# For local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/tinylink"

NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Run Migrations (30 seconds)

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push
```

### 5. Start Development Server (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Verify Installation

✅ Visit `http://localhost:3000` - Dashboard should load  
✅ Visit `http://localhost:3000/healthz` - Should return `{"ok": true, ...}`  
✅ Create a test link - Should work without errors  

## Quick Test

1. **Create a link**:
   - URL: `https://google.com`
   - Custom code: `test123`
   - Click "Create Short Link"

2. **Test redirect**:
   - Visit `http://localhost:3000/test123`
   - Should redirect to Google

3. **Check stats**:
   - Go back to dashboard
   - Click "Stats" on your link
   - Should show 1 click

## Common Issues

### Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solution**: Check your `DATABASE_URL` is correct

### Prisma Client Error
```
Error: @prisma/client did not initialize yet
```
**Solution**: Run `npx prisma generate`

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: Kill the process or use different port:
```bash
PORT=3001 npm run dev
```

### Migration Errors
```
Error: Migration failed
```
**Solution**: Reset and try again:
```bash
npx prisma migrate reset
npx prisma db push
```

## What's Next?

- Read [README.md](README.md) for full documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Check [TESTING.md](TESTING.md) for testing guide
- Review [VIDEO_SCRIPT.md](VIDEO_SCRIPT.md) for walkthrough

## Project Structure at a Glance

```
tiny-url/
├── app/
│   ├── api/links/          # API endpoints
│   ├── code/[code]/        # Stats page
│   ├── [code]/             # Redirect handler
│   └── page.tsx            # Dashboard
├── components/             # React components
├── prisma/                 # Database schema
└── lib/                    # Utilities
```

## Essential Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema changes
npx prisma generate      # Generate client

# Production
npm run build            # Build for production
npm start                # Start production server
```

## Get Help

- Check the full [README.md](README.md)
- Review error messages carefully
- Check browser console for client errors
- Check terminal for server errors
- Ensure `.env` file exists and is configured

## Success! 🎉

You should now have TinyLink running locally. Start creating short links!

**Next Steps**:
1. Explore the dashboard
2. Create some links
3. Test redirects
4. View stats
5. Try the API endpoints
6. Read deployment guide for going live
