-- TinyLink Database Schema
-- Run this in Neon SQL Editor: https://console.neon.tech/app/projects/rough-block-36465041?database=neondb

-- Create Link table
CREATE TABLE IF NOT EXISTS "Link" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "lastClicked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- Create unique index on code
CREATE UNIQUE INDEX IF NOT EXISTS "Link_code_key" ON "Link"("code");

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "Link_code_idx" ON "Link"("code");
