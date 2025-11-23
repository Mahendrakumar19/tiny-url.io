# TinyLink Video Walkthrough Script

## Introduction (30 seconds)

"Hi! I'm presenting my TinyLink URL shortener application, built as a take-home assignment. This is a full-stack application using Next.js 15, TypeScript, Prisma ORM, and PostgreSQL. Let me walk you through the features and implementation."

## Architecture Overview (1 minute)

"First, let's look at the project structure:

- **Frontend**: Next.js 15 with React Server Components and Client Components
- **Backend**: Next.js API Routes for RESTful endpoints
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Styling**: Tailwind CSS 4 for responsive, modern UI
- **Validation**: Zod for runtime type validation
- **Hosting**: Designed for Vercel with Neon PostgreSQL

The app follows a clean architecture with separation of concerns:
- API routes in `/app/api`
- Page components in `/app`
- Reusable UI components in `/components`
- Database client in `/lib`
- Type definitions in `/types`"

## Database Schema (30 seconds)

"The database schema is simple but effective. We have a single Link model with:
- **id**: Unique identifier
- **code**: The short code (unique, indexed for fast lookups)
- **targetUrl**: The destination URL
- **totalClicks**: Counter for analytics
- **lastClicked**: Timestamp of last redirect
- **createdAt/updatedAt**: Audit timestamps

Prisma generates type-safe client code from this schema."

## API Endpoints Demo (2 minutes)

"Let me demonstrate the API endpoints as specified in the requirements:

### Health Check
First, `/healthz` returns a 200 status with system information:
```json
{
  "ok": true,
  "version": "1.0",
  "timestamp": "...",
  "uptime": 12345.67
}
```

### POST /api/links - Create Link
This endpoint accepts a target URL and optional custom code.
[Show in Postman/browser DevTools]
- Validates URL format
- Validates code format (6-8 alphanumeric)
- Checks for duplicate codes → returns 409 if exists
- Generates random code if not provided
- Returns 201 with created link

### GET /api/links - List All Links
Returns all links in the system with full details.

### GET /api/links/:code - Get Single Link
Returns stats for a specific link, used by the stats page.

### DELETE /api/links/:code - Delete Link
Removes a link from the system. After deletion, the redirect will return 404."

## Dashboard Demo (2 minutes)

"Now let's look at the user interface. The dashboard is the main page at `/`.

### Empty State
When there are no links, we show a friendly empty state with an icon and helpful message.

### Create Link Form
The form has:
- Target URL field (required)
- Custom code field (optional)
- Real-time validation with helpful error messages
- Loading states during submission
- Success confirmation

Let me create a link:
[Demo creating a link with custom code 'docs123']

Notice:
- Inline validation as I type
- The button disables during submission
- Success message appears
- Link immediately appears in table

### Validation
Let me show the validation:
[Demo various validation scenarios]
- Empty URL → error
- Invalid URL → error  
- Code too short → error
- Code with special characters → error
- Duplicate code → 409 error with clear message

### Table Features
The table shows all links with:
- Short code with copy button
- Target URL (truncated with ellipsis if long)
- Total clicks
- Last clicked timestamp
- Action buttons (Stats and Delete)

Features:
- **Sorting**: Click column headers to sort by clicks or date
- **Search**: Filter by code or URL in real-time
- **Copy**: One-click copy of short URL to clipboard
- **Responsive**: Scrolls horizontally on mobile

[Demo each feature]"

## Redirect Functionality (1 minute)

"The core feature is the redirect. When you visit `/:code`, it:
1. Looks up the link in database
2. Increments the click counter
3. Updates the last clicked timestamp
4. Performs a 302 redirect to the target URL

Let me demonstrate:
[Click on a short link or visit in new tab]

See how it redirected instantly? Now let's check the stats...
[Go back to dashboard]
The click count has incremented and last clicked time is updated!"

## Stats Page Demo (1 minute)

"Each link has a detailed stats page at `/code/:code`.

[Navigate to stats page]

Here you can see:
- The short code prominently displayed
- Copy button for the short URL
- Statistics in a grid:
  - Total clicks
  - Last clicked time
  - Creation date
  - Last updated time
- The target URL with a link
- Quick actions:
  - Test redirect button
  - Copy URL button

The design is clean and informative. Let me test the redirect from here...
[Click Test Redirect button]"

## Delete Functionality (45 seconds)

"Let me demonstrate the delete functionality:
[Go to dashboard, click Delete on a link]

Notice:
- Confirmation dialog to prevent accidents
- Link is removed from table
- Database record is deleted

Now, let's verify the redirect no longer works:
[Try to visit the deleted code]

Perfect! It returns a 404 as expected. This is a key requirement for the autograding."

## Responsive Design (45 seconds)

"The app is fully responsive. Let me show you:
[Open DevTools and switch to mobile view]

On mobile:
- The layout adapts gracefully
- Forms are full width
- Table scrolls horizontally
- Touch-friendly buttons
- Proper spacing and typography

[Show tablet view]
[Show desktop view]

The design remains clean and functional at all viewport sizes."

## Error Handling (30 seconds)

"Error handling is comprehensive:
- Network errors show user-friendly messages
- Validation errors are inline and specific
- 404 pages for non-existent links
- Loading states prevent confusion
- Form disabling prevents duplicate submissions

[Demo a few error scenarios]"

## Code Walkthrough (2 minutes)

"Let me briefly walk through the code structure:

### API Route: POST /api/links
[Open the file]
- Uses Zod for validation
- Type-safe database operations with Prisma
- Proper error handling with appropriate status codes
- Random code generation if needed
- Duplicate checking returns 409 as required

### Redirect Handler: [code]/route.ts
[Open the file]
- Uses Next.js dynamic routing
- Atomic update of click count
- Returns 404 for non-existent codes
- 302 redirect with Next.js redirect function

### Dashboard Component
[Open page.tsx]
- Client component for interactivity
- State management with useState
- useEffect for data fetching
- Proper loading and error states
- Clean separation of concerns with sub-components

### Reusable Components
[Show AddLinkForm.tsx and LinksTable.tsx]
- Self-contained with their own state
- Props for parent communication
- Proper TypeScript typing
- Accessibility considerations"

## Database & Prisma (1 minute)

"Prisma provides:
- Type-safe database client
- Automatic migrations
- Query builder that prevents SQL injection
- Schema versioning

[Show schema.prisma file]
[Show a database query in code]

The integration is seamless and the developer experience is excellent."

## Testing (1 minute)

"I've created comprehensive testing documentation in TESTING.md.

Key test scenarios:
- Health check returns 200
- Creating links works correctly
- Duplicate codes return 409 (crucial for autograding)
- Redirects work and track clicks
- Deletion works and stops redirects (404)
- All validation scenarios
- Responsive design
- Error states

[Show the TESTING.md file briefly]

I've manually tested all scenarios and they work as expected."

## Deployment (1 minute)

"The application is deployed on Vercel with Neon PostgreSQL.

Deployment is straightforward:
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

[Show the deployed site]

The production URL is: [your-url].vercel.app

All features work identically in production:
- Health check at /healthz
- API endpoints
- Dashboard
- Redirects with click tracking

[Show DEPLOYMENT.md file briefly]

I've documented the entire deployment process step-by-step."

## Challenges & Solutions (1 minute)

"During development, I faced a few interesting challenges:

1. **Prisma 7 Configuration**: The new version uses a different config format. I adapted to use `prisma.config.ts` instead of inline datasource URLs.

2. **Type Safety with Dates**: Prisma returns Date objects, but JSON serialization converts them to strings. I handled this with proper TypeScript types.

3. **Redirect with Click Tracking**: Ensuring atomic updates while performing fast redirects required careful use of Prisma's increment operator.

4. **Form Validation**: Implementing both client-side and server-side validation with consistent error messages across the app.

All challenges were solved following best practices and the solutions are production-ready."

## Technical Decisions (1 minute)

"Key technical decisions and rationale:

1. **Next.js 15 with App Router**: Modern, performant, great DX, and excellent for this use case with mixed SSR/CSR.

2. **Prisma ORM**: Type safety, great migrations, prevents SQL injection, excellent DX.

3. **Tailwind CSS**: Rapid development, consistent design, built-in responsiveness.

4. **Zod Validation**: Runtime type checking, great error messages, TypeScript integration.

5. **No Authentication**: Per requirements, focused on core URL shortening functionality. Can easily add next.

6. **Single Database Table**: Keeps it simple. Easily extensible for future features.

7. **Client Components for Interactivity**: Server components for static content, client components for forms and interactions."

## Code Quality (45 seconds)

"Code quality considerations:

- **TypeScript**: Full type safety throughout
- **ESLint**: Configured with Next.js recommended rules
- **Consistent Formatting**: Clean, readable code
- **Error Handling**: Comprehensive try-catch blocks
- **Loading States**: Better UX
- **Comments**: Where needed for clarity
- **Separation of Concerns**: Components, API routes, utilities
- **Reusable Components**: DRY principle
- **Environment Variables**: Secure configuration
- **Git Commits**: Clear, descriptive messages"

## Bonus Features (30 seconds)

"Beyond the requirements, I added:

- **Search/Filter**: Find links quickly
- **Sortable Columns**: Sort by clicks or date
- **Copy to Clipboard**: One-click copy
- **Detailed Stats Page**: More than just numbers
- **Empty States**: Better UX
- **Loading States**: Clear feedback
- **Responsive Design**: Works everywhere
- **Comprehensive Documentation**: README, DEPLOYMENT, TESTING guides"

## Conclusion (30 seconds)

"In summary, TinyLink is a complete, production-ready URL shortener that:
- Meets all specified requirements
- Follows the API and URL conventions for autograding
- Has a polished, responsive UI
- Includes comprehensive error handling
- Is fully deployed and functional
- Has excellent documentation

The project demonstrates full-stack development skills, attention to detail, and ability to build production-quality applications.

Thank you for reviewing my submission!

**Links**:
- Live Demo: [your-url].vercel.app
- GitHub: [your-repo-url]
- This Video: [video-url]"

---

## Tips for Recording

1. **Prepare**: Test everything before recording
2. **Screen Setup**: Clean desktop, close unnecessary apps, use high resolution
3. **Audio**: Use good microphone, quiet environment
4. **Pacing**: Speak clearly, not too fast
5. **Show, Don't Just Tell**: Actually click through features
6. **Zoom In**: Make sure code is readable
7. **Practice**: Do a dry run
8. **Time Management**: Keep each section to approximate times listed
9. **Energy**: Stay enthusiastic but professional
10. **Backup**: Have a script but don't read it robotically

## Recording Checklist

- [ ] Database has sample data
- [ ] App is running locally or use production
- [ ] Browser is full screen or large window
- [ ] DevTools ready for network tab demos
- [ ] Code editor ready with files open
- [ ] Documentation files ready to show
- [ ] Postman/Thunder Client ready for API demos
- [ ] Good lighting
- [ ] Mic test
- [ ] Practice run completed

Total estimated time: 12-15 minutes
