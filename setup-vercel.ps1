#!/usr/bin/env pwsh
# Setup script for TinyLink Vercel deployment

Write-Host "🚀 Setting up TinyLink on Vercel..." -ForegroundColor Cyan
Write-Host ""

# Database URL
$DATABASE_URL = "postgresql://neondb_owner:npg_LGY5IDiZ2kOB@ep-billowing-dust-ahlq07r1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

Write-Host "📝 Step 1: Setting DATABASE_URL..." -ForegroundColor Yellow
Write-Host $DATABASE_URL | vercel env add DATABASE_URL production

Write-Host ""
Write-Host "📝 Step 2: Setting NEXT_PUBLIC_BASE_URL..." -ForegroundColor Yellow
Write-Host "https://tiny-url-io.vercel.app" | vercel env add NEXT_PUBLIC_BASE_URL production

Write-Host ""
Write-Host "🚀 Step 3: Deploying to production..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "Visit: https://tiny-url-io.vercel.app" -ForegroundColor Cyan
