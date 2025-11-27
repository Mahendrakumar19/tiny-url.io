-- TinyLink Database Schema for Neon
-- Run this SQL in Neon SQL Editor: https://console.neon.tech/app/projects/rough-block-36465041

-- Create the Link table
CREATE TABLE IF NOT EXISTS "Link" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "code" TEXT NOT NULL UNIQUE,
    "targetUrl" TEXT NOT NULL,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "lastClicked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "Link_code_idx" ON "Link"("code");

-- Optional: Insert test data
INSERT INTO "Link" ("id", "code", "targetUrl", "totalClicks", "lastClicked", "createdAt", "updatedAt")
VALUES 
    (gen_random_uuid()::text, 'test', 'https://google.com', 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

-- Verify table was created
SELECT * FROM "Link";
