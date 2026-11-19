# KayaHub Product Roadmap

**Vision:** Build the most trusted rental platform in Kenya by making property discovery transparent, secure, and easy for both tenants and landlords.

Legend: [x] done · [ ] not started · 🔄 built, not yet merged or live

## ✅ Phase 1: MVP (Completed)
Core rental experience.

**Authentication**
- [x] Tenant signup/login
- [x] Landlord signup/login
- [x] Admin authentication
- [x] JWT authentication

**Tenant Experience**
- [x] Browse listings
- [x] Search
- [x] Filters
- [x] Favorites
- [x] Property details
- [x] Property image gallery
- [x] Report listing

**Landlord Experience**
- [x] Create listings
- [x] Edit listings
- [x] Delete listings
- [x] Upload multiple images
- [x] Cover image selection
- [x] Delete images
- [x] Availability confirmation
- [x] Mark property as rented

**Admin Experience**
- [x] Approve listings
- [x] Reject listings
- [x] Suspend listings
- [x] Moderate reports
- [x] Review pending listings

**Messaging**
- [x] Tenant ↔ Landlord conversations
- [x] Latest message preview
- [x] Conversation ordering
- [x] Unread message count
- [x] Auto-refresh polling
- [x] Link conversation to listing

## 🚀 Phase 2: Beta (Mostly complete)
Focus on stability and production readiness.

**Authentication**
- [x] HTTP-only cookies
- [x] Refresh tokens
- [x] Session expiration
- [x] CSRF protection (listing actions; profile photo upload still missing it, see Tech debt)

**User Experience**
- [x] Skeleton loading
- [x] Toast notifications
- [x] Empty states
- [x] Better error pages
- [x] Preserve session when backend is temporarily unavailable
- [x] Restore cached user after refresh
- [x] Mobile layout fixes for the messages pages
- [x] Image uploads: compression in the browser, size and type validation on the server, clear error messages
- 🔄 Compact listing cards and a 4-column desktop grid
- [ ] Mobile layout fixes for the remaining pages (about 20 still use the old layout pattern)
- [ ] Mobile filter row: make the scroll obvious, or move to a filters sheet

**Performance**
- [x] Cloudinary image optimization
- [x] Lazy image loading
- [x] Pagination
- [x] Query optimization

**Deployment**
- [x] Deploy FastAPI (Render)
- [x] Deploy Next.js (Vercel)
- [x] Managed PostgreSQL (Render)
- [x] Production CORS
- [x] HTTPS
- [x] Custom domain: kayahub.co.ke
- [ ] Confirm `FRONTEND_URL` in Render points to the new domain, not the old vercel.app address
- [ ] Paid Render plans checked: database (no expiry) and web service (no cold starts)
- [ ] Manual database backup process before each production migration

**Monitoring (Sentry)**
- [x] Backend: unhandled exceptions, 5xx errors, request traces
- [x] Frontend: uncaught React/Next.js errors, client-side exceptions
- [x] Image-upload failures reported to Sentry
- [x] Backend health endpoint
- [ ] Alert rules (5xx spike, auth failures)
- [ ] Lower `traces_sample_rate` once traffic grows
- [ ] Render CPU/memory and restart alerts
- [ ] Vercel runtime error alerts

**Brand**
- [x] Renamed to KayaHub
- 🔄 New logo, favicon and apple icon
- 🔄 New social share image (WhatsApp/X link previews)

## ⭐ Phase 3: Public Launch
**Trust Features**
- [x] Verified property badge (admin-only; requires an approved listing; recorded with admin and time; cleared on reject or suspend)
- [ ] Phone verification: OTP mechanism, SMS provider stubbed first, optional at first. **← next**
- [ ] Email verification (verify-email page exists; confirm the flow works end to end)
- [ ] Verified landlord badge
- [ ] Identity verification
- [ ] Government ID verification

**Landlord Profiles**
- [x] Profile photo
- [ ] Profile page (a basic page exists; still needs the fields below)
- [ ] Member since
- [ ] Number of successful rentals
- [ ] Average response time
- [ ] Verified status
- [ ] About landlord

**Analytics Dashboard**

Landlord analytics:
- [ ] Listing views
- [ ] Favorites
- [ ] Messages received
- [ ] Conversion rate
- [ ] Availability confirmations

Admin analytics:
- [ ] Active users
- [ ] Listings created
- [ ] Pending approvals
- [ ] Reports received
- [ ] Suspended listings

## ⭐ Phase 4: Enhanced Search
Improve property discovery.
- [ ] Interactive map search
- [ ] Nearby schools
- [ ] Nearby hospitals
- [ ] Nearby transport
- [ ] Nearby shopping centers
- [ ] Commute estimates

Additional filters:
- [ ] Furnished
- [ ] Pet friendly
- [ ] Gated community
- [ ] Swimming pool
- [ ] Gym
- [ ] Parking type

## ⭐ Phase 5: Viewing Experience
- [ ] Viewing request scheduling
- [ ] Calendar integration
- [ ] Viewing reminders
- [ ] Landlord availability calendar
- [ ] Cancel/reschedule viewings

## ⭐ Phase 6: Reviews & Reputation
After successful rentals, tenants can review:
- [ ] Landlord
- [ ] Property accuracy

Landlords can review:
- [ ] Tenant communication
- [ ] Viewing attendance

## ⭐ Phase 7: Notifications
- [ ] Email notifications
- [ ] Push notifications
- [ ] SMS reminders
- [ ] New message alerts
- [ ] Listing approved
- [ ] Listing rejected
- [ ] Viewing reminder

## ⭐ Phase 8: Payments
- [ ] Rent payment integration
- [ ] Booking deposits
- [ ] M-Pesa integration
- [ ] Payment history
- [ ] Digital receipts

## ⭐ Phase 9: AI Features (Future)
AI should assist, not replace, human decisions.

Search:
- [ ] Natural language search
- [ ] Personalized recommendations
- [ ] Similar property suggestions

Moderation:
- [ ] Scam detection
- [ ] Duplicate listing detection
- [ ] Suspicious image detection
- [ ] Fraud risk scoring
- [ ] Report prioritization

Landlords:
- [ ] AI-generated listing descriptions
- [ ] Photo quality feedback
- [ ] Pricing suggestions

## ⭐ Phase 10: Business Growth
- [ ] Agent accounts
- [ ] Agency dashboards
- [ ] Property management companies
- [ ] Premium listings
- [ ] Featured properties
- [ ] Sponsored search results

## Tech debt and known issues
- [ ] Add CSRF protection to the profile-photo upload endpoint (listing image endpoints already have it)
- [ ] Edit-listing form shows a photo picker but silently drops the photos
- [ ] Profile upload is `async def` but calls Cloudinary synchronously, which blocks the server during uploads
- [ ] ImageUploader: one unreadable file turns off low-resolution warnings for the whole batch
- [ ] Delete the unused duplicate page `/listings/new`
- [ ] HEIC photos from Android/desktop are rejected (iPhone converts automatically); consider server or browser conversion
- [ ] Listings with no photo: show a placeholder instead of the browser's broken-image icon
- [ ] Bedsitters show "0 bd": display "Bedsitter" instead
- [ ] Landlord and admin pages use their own card components, so they don't get the compact card style
- [ ] Repo lives in an iCloud-synced folder, which creates stray duplicate files and can break builds: move it out of iCloud
- [ ] Lint baseline: 10 errors and 19 warnings to clear over time

## Long-Term Vision
KayaHub aims to become the most trusted rental platform in Kenya by focusing on transparency, verified listings, secure communication, and an exceptional rental experience for both tenants and landlords.

Rather than competing on the number of listings alone, KayaHub's competitive advantage is trust.

Every feature should support one or more of these principles:
- Transparency
- Security
- Simplicity
- Trust
- Speed
