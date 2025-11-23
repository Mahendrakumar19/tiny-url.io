# TinyLink - URL Shortener

A modern, full-featured URL shortener built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

✅ **Create Short Links** - Convert long URLs into short, shareable links with optional custom codes  
✅ **Click Tracking** - Track total clicks and last clicked timestamp for each link  
✅ **Dashboard** - Manage all your links with search and sort functionality  
✅ **Stats Page** - View detailed statistics for individual links  
✅ **Auto Redirect** - Fast 302 redirects with click tracking  
✅ **Responsive Design** - Clean, mobile-friendly interface  
✅ **Form Validation** - Client and server-side validation  
✅ **Health Check** - System monitoring endpoint  

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Hosting**: Vercel (frontend) + Neon (database)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or Neon)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tiny-url
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## API Endpoints

### Links Management

- **POST** `/api/links` - Create a new short link
  ```json
  {
    "targetUrl": "https://example.com/long-url",
    "code": "mycode" // optional, 6-8 alphanumeric characters
  }
  ```
  - Returns 201 on success
  - Returns 409 if code already exists
  - Returns 400 for validation errors

- **GET** `/api/links` - List all links
  - Returns array of link objects

- **GET** `/api/links/:code` - Get stats for a single link
  - Returns link object or 404 if not found

- **DELETE** `/api/links/:code` - Delete a link
  - Returns 200 on success or 404 if not found

### Health Check

- **GET** `/healthz` - System health check
  ```json
  {
    "ok": true,
    "version": "1.0",
    "timestamp": "2025-11-21T...",
    "uptime": 12345.67
  }
  ```

### Redirect

- **GET** `/:code` - Redirect to target URL
  - Performs 302 redirect
  - Increments click count
  - Updates last clicked timestamp
  - Returns 404 if link not found

## Pages & Routes

| Path | Description |
|------|-------------|
| `/` | Dashboard - List, create, and delete links |
| `/code/:code` | Stats page for a single link |
| `/:code` | Redirect endpoint |
| `/healthz` | Health check endpoint |

## Database Schema

```prisma
model Link {
  id           String   @id @default(cuid())
  code         String   @unique
  targetUrl    String
  totalClicks  Int      @default(0)
  lastClicked  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. Configure environment variables in Vercel:
   - `DATABASE_URL` - Your Neon Postgres connection string
   - `NEXT_PUBLIC_BASE_URL` - Your Vercel deployment URL

4. Deploy! Vercel will automatically:
   - Build your Next.js app
   - Run database migrations
   - Deploy to production

### Set up Neon Database

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `.env` and Vercel environment variables

### Post-Deployment

After deploying, run migrations on production database:
```bash
npx prisma migrate deploy
```

Or use Vercel's build command to run migrations automatically.

## Development

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (DEV ONLY)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Testing

The app follows the specified conventions for automated testing:

- Health endpoint returns 200 at `/healthz`
- Creating duplicate codes returns 409 status
- Codes follow `[A-Za-z0-9]{6,8}` pattern
- Redirects work and increment click count
- Deletion stops redirects (returns 404)

## Project Structure

```
tiny-url/
├── app/
│   ├── [code]/          # Redirect handler
│   ├── api/
│   │   ├── links/       # Links API endpoints
│   │   └── healthz/     # Health check
│   ├── code/[code]/     # Stats page
│   ├── healthz/         # Health check page route
│   └── page.tsx         # Dashboard
├── components/
│   ├── AddLinkForm.tsx  # Form for creating links
│   └── LinksTable.tsx   # Table for displaying links
├── lib/
│   └── db.ts            # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Features Implemented

### Core Features
- ✅ Create short links with optional custom codes
- ✅ 302 redirects with click tracking
- ✅ Delete links (404 after deletion)
- ✅ Dashboard with search/filter
- ✅ Stats page for individual links
- ✅ Health check endpoint

### UX Features
- ✅ Loading states
- ✅ Error states
- ✅ Empty states
- ✅ Form validation
- ✅ Success confirmations
- ✅ Copy to clipboard
- ✅ Sortable tables
- ✅ URL truncation with ellipsis
- ✅ Responsive design

## License

MIT

## Author

Created as a take-home assignment for demonstrating full-stack development skills.
