# Testing Guide for TinyLink

## Manual Testing Checklist

### 1. Health Check Endpoint
- [ ] Visit `/healthz`
- [ ] Should return 200 status
- [ ] Response should include: `{"ok": true, "version": "1.0", ...}`

### 2. Dashboard (/)

#### Empty State
- [ ] Visit `/` with empty database
- [ ] Should show "No links found" message
- [ ] Should show empty state icon
- [ ] Should show "Get started by creating a new short link" text

#### Create Link - Auto-generated Code
- [ ] Enter valid URL (e.g., `https://google.com`)
- [ ] Leave code field empty
- [ ] Click "Create Short Link"
- [ ] Should show success message
- [ ] Should generate 6-character alphanumeric code
- [ ] Link should appear in table

#### Create Link - Custom Code
- [ ] Enter valid URL
- [ ] Enter custom code (6-8 alphanumeric characters, e.g., `docs123`)
- [ ] Click "Create Short Link"
- [ ] Should show success message
- [ ] Should use your custom code
- [ ] Link should appear in table

#### Validation Tests
- [ ] Try empty URL → should show "URL is required" error
- [ ] Try invalid URL (e.g., `not-a-url`) → should show "Invalid URL format" error
- [ ] Try code with 5 characters → should show "Code must be 6-8 alphanumeric characters" error
- [ ] Try code with 9 characters → should show validation error
- [ ] Try code with special characters → should show validation error
- [ ] Try duplicate code → should show "Code already exists" error (409 status)

#### Loading States
- [ ] Click "Create Short Link" and observe button text changes to "Creating..."
- [ ] Button should be disabled during creation
- [ ] Loading spinner should appear when fetching links

#### Table Features
- [ ] Click on "Total Clicks" header → should sort by clicks
- [ ] Click again → should reverse sort order
- [ ] Click on "Last Clicked" header → should sort by date
- [ ] Long URLs should be truncated with ellipsis
- [ ] Hover over truncated URL → should show full URL (title attribute)

#### Copy Functionality
- [ ] Click copy button next to a short code
- [ ] Should copy full short URL to clipboard
- [ ] Icon should change to checkmark briefly
- [ ] Should show green checkmark for 2 seconds

#### Search/Filter
- [ ] Type in search box (e.g., "google")
- [ ] Should filter links by code or URL
- [ ] Clear search → should show all links
- [ ] Search with no results → should show "No links found" with "Try a different search term"

#### Delete Link
- [ ] Click "Delete" button on a link
- [ ] Should show confirmation dialog
- [ ] Click "Cancel" → link should remain
- [ ] Click "Delete" → confirm again → link should be removed from table
- [ ] Link count should decrease

### 3. Redirect (/:code)

#### Successful Redirect
- [ ] Create a link with code `test123` pointing to `https://google.com`
- [ ] Visit `/:test123`
- [ ] Should redirect to Google (302 redirect)
- [ ] Should increment click count (check in dashboard)
- [ ] Should update "last clicked" timestamp

#### Multiple Redirects
- [ ] Click the same short link 5 times
- [ ] Check dashboard → total clicks should be 5
- [ ] Last clicked should show recent timestamp

#### 404 for Non-existent Link
- [ ] Visit `/:nonexistent`
- [ ] Should return 404 status
- [ ] Should show "Link not found" message

#### After Deletion
- [ ] Create link with code `delete123`
- [ ] Visit `/:delete123` → should redirect successfully
- [ ] Delete the link from dashboard
- [ ] Visit `/:delete123` again
- [ ] Should return 404 (not redirect)

### 4. Stats Page (/code/:code)

#### View Stats
- [ ] Create a link with code `stats123`
- [ ] Click "Stats" button in dashboard
- [ ] Should navigate to `/code/stats123`
- [ ] Should show:
  - Short code in large font
  - Total clicks (should be 0 initially)
  - Last clicked (should show "Never")
  - Created date
  - Last updated date
  - Target URL with link

#### After Clicks
- [ ] Visit `/:stats123` to trigger redirect
- [ ] Go back to stats page `/code/stats123`
- [ ] Total clicks should be 1
- [ ] Last clicked should show recent timestamp

#### Copy from Stats Page
- [ ] Click "Copy Short URL" button
- [ ] Should copy to clipboard
- [ ] Button text should change to "✓ Copied!" briefly

#### Test Redirect Button
- [ ] Click "Test Redirect" button
- [ ] Should open short URL in new tab
- [ ] Should perform redirect

#### 404 for Non-existent Code
- [ ] Visit `/code/nonexistent`
- [ ] Should show error state
- [ ] Should show "Link Not Found" message
- [ ] Should show "Go to Dashboard" button

#### Back to Dashboard
- [ ] Click "← Back to Dashboard" link
- [ ] Should navigate to home page

### 5. Responsive Design

#### Mobile View (375px)
- [ ] Open dashboard on mobile viewport
- [ ] Form should be full width
- [ ] Table should be scrollable horizontally
- [ ] Buttons should be appropriately sized
- [ ] Header should stack properly

#### Tablet View (768px)
- [ ] Layout should adapt gracefully
- [ ] Stats grid should use 2 columns
- [ ] Search box should have appropriate width

#### Desktop View (1024px+)
- [ ] Content should be centered with max width
- [ ] All elements should have proper spacing
- [ ] Stats grid should show 2 columns

### 6. API Endpoint Testing

#### POST /api/links
```bash
# Test with curl or Postman
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://example.com", "code": "test123"}'

# Expected: 201 status with link object
# Duplicate code: 409 status with error
# Invalid URL: 400 status with error
```

#### GET /api/links
```bash
curl http://localhost:3000/api/links

# Expected: 200 status with array of links
```

#### GET /api/links/:code
```bash
curl http://localhost:3000/api/links/test123

# Expected: 200 status with link object
# Not found: 404 status
```

#### DELETE /api/links/:code
```bash
curl -X DELETE http://localhost:3000/api/links/test123

# Expected: 200 status with success message
# Not found: 404 status
```

## Automated Testing Script

Create a test script to verify core functionality:

```javascript
// test-api.js
const BASE_URL = 'http://localhost:3000';

async function testHealthCheck() {
  const res = await fetch(`${BASE_URL}/healthz`);
  console.assert(res.status === 200, 'Health check failed');
  const data = await res.json();
  console.assert(data.ok === true, 'Health check not ok');
  console.log('✓ Health check passed');
}

async function testCreateLink() {
  const res = await fetch(`${BASE_URL}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targetUrl: 'https://google.com',
      code: 'test' + Date.now()
    })
  });
  console.assert(res.status === 201, 'Create link failed');
  const data = await res.json();
  console.assert(data.code, 'No code returned');
  console.log('✓ Create link passed');
  return data.code;
}

async function testDuplicateCode(code) {
  const res = await fetch(`${BASE_URL}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targetUrl: 'https://example.com',
      code: code
    })
  });
  console.assert(res.status === 409, 'Duplicate code check failed');
  console.log('✓ Duplicate code check passed');
}

async function testRedirect(code) {
  const res = await fetch(`${BASE_URL}/${code}`, {
    redirect: 'manual'
  });
  console.assert(res.status === 302, 'Redirect failed');
  console.log('✓ Redirect passed');
}

async function testGetLink(code) {
  const res = await fetch(`${BASE_URL}/api/links/${code}`);
  console.assert(res.status === 200, 'Get link failed');
  const data = await res.json();
  console.assert(data.totalClicks >= 1, 'Click count not incremented');
  console.log('✓ Get link and click tracking passed');
}

async function testDeleteLink(code) {
  const res = await fetch(`${BASE_URL}/api/links/${code}`, {
    method: 'DELETE'
  });
  console.assert(res.status === 200, 'Delete link failed');
  console.log('✓ Delete link passed');
}

async function testDeletedLinkRedirect(code) {
  const res = await fetch(`${BASE_URL}/${code}`, {
    redirect: 'manual'
  });
  console.assert(res.status === 404, 'Deleted link still redirects');
  console.log('✓ Deleted link 404 check passed');
}

async function runTests() {
  console.log('Starting tests...\n');
  
  await testHealthCheck();
  const code = await testCreateLink();
  await testDuplicateCode(code);
  await testRedirect(code);
  await testGetLink(code);
  await testDeleteLink(code);
  await testDeletedLinkRedirect(code);
  
  console.log('\n✓ All tests passed!');
}

runTests().catch(console.error);
```

Run with: `node test-api.js`

## Performance Testing

### Load Testing
- [ ] Create 100+ links
- [ ] Dashboard should load quickly
- [ ] Search/filter should remain responsive
- [ ] Pagination might be needed for production

### Redirect Performance
- [ ] Test redirect speed
- [ ] Should complete in < 200ms
- [ ] Database query should be efficient

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing

- [ ] Tab navigation works through form
- [ ] Form inputs have proper labels
- [ ] Buttons have descriptive text
- [ ] Error messages are clear
- [ ] Sufficient color contrast
- [ ] Screen reader compatibility

## Security Testing

- [ ] SQL injection attempts in URL field → should be sanitized by Prisma
- [ ] XSS attempts in URL field → should be sanitized
- [ ] Invalid JSON to API → should return 400
- [ ] Very long URLs → should handle gracefully
- [ ] Special characters in code → should be validated

## Edge Cases

- [ ] URL with query parameters
- [ ] URL with fragments (#)
- [ ] Very long URLs (2000+ characters)
- [ ] URLs with special characters
- [ ] Code at exactly 6 characters
- [ ] Code at exactly 8 characters
- [ ] Rapid clicks on same link
- [ ] Concurrent link creation
- [ ] Database connection loss → should show error

## Production Verification

After deployment:
- [ ] All tests pass on production URL
- [ ] Environment variables are set correctly
- [ ] Database migrations ran successfully
- [ ] SSL/HTTPS is working
- [ ] No console errors in browser
- [ ] No server errors in logs

## Bug Report Template

If you find issues:

```
**Title**: Brief description

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happened

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- URL: https://...

**Screenshots**: (if applicable)
```

## Known Limitations

- No authentication/user management (links are public)
- No rate limiting (consider adding for production)
- No analytics (just click counts)
- No QR code generation (could be added)
- No link expiration (could be added)
- No custom domains (uses main domain)

## Future Enhancements

- Add user authentication
- Add analytics dashboard
- Add QR code generation
- Add link expiration dates
- Add rate limiting
- Add API key authentication
- Add custom domains
- Add link categories/tags
- Add bulk operations
