# Flex Living Reviews Dashboard

A comprehensive review management system for Flex Living properties built with Next.js 15, next-safe-action, Prisma, and Supabase.

## Features

- 🔐 **Authentication System** - Secure manager login with Supabase Auth
- 📊 **Dashboard** - Comprehensive review management with filters and stats
- ⭐ **Review Management** - Approve, feature, and organize reviews
- 🔄 **API Integration** - Sync reviews from Hostaway
- 🏠 **Public Property Pages** - Display approved reviews to guests
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- 🔒 **Type-Safe Actions** - Server actions with Zod validation via next-safe-action

## Tech Stack

### Core Framework & Language
- **Next.js 15** (App Router) - React-based framework with server-side rendering and server actions
- **React 19** - UI library with latest concurrent features
- **TypeScript 5** - Type-safe development with strict type checking

### Backend & Data Layer
- **next-safe-action** - Type-safe server actions with Zod validation
- **Prisma ORM** - Database toolkit for PostgreSQL with type-safe queries
- **PostgreSQL** (via Supabase) - Relational database for data persistence
- **Supabase Auth** - Authentication and session management

### Frontend & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library built on Radix UI
- **Zustand** - Lightweight state management for client-side filters
- **date-fns** - Date manipulation and formatting

### API Integrations
- **Hostaway API** - Property management system integration for review syncing
- **Supabase SSR** - Server-side rendering compatible auth client

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Hostaway API credentials

### Installation

1. **Clone the repository**

   ```bash
   cd flex-living-reviews
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your credentials:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Database
   DATABASE_URL=your_postgresql_connection_string

   HOSTAWAY_API_KEY=your_hostaway_api_key
   HOSTAWAY_ACCOUNT_ID=your_hostaway_account_id
   ```

4. **Set up the database**

   Generate Prisma client:

   ```bash
   npm run db:generate
   ```

   Push schema to database:

   ```bash
   npm run db:push
   ```

   Seed the database with sample data:

   ```bash
   npm run db:seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Credentials

After seeding, you can log in with:

- **Email**: manager@flexliving.com
- **Password**: password123

## Project Structure

```
flex-living-reviews/
├── actions/              # Server actions (next-safe-action)
│   ├── auth/            # Authentication actions
│   ├── properties/      # Property actions
│   └── reviews/         # Review actions
├── app/                 # Next.js app directory
│   ├── auth/           # Auth pages (login, signup)
│   ├── dashboard/      # Manager dashboard
│   ├── properties/     # Public property pages
│   └── page.tsx        # Landing page
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   ├── property/       # Property page components
│   └── ui/             # Reusable UI components
├── lib/                 # Utilities and configurations
│   ├── db/             # Database client
│   ├── hostaway/       # Hostaway API integration
│   ├── schemas/        # Zod schemas
│   ├── supabase/       # Supabase clients
│   └── safe-action.ts  # next-safe-action configuration
├── prisma/              # Prisma schema and migrations
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed script
├── public/              # Static assets
│   └── mock-reviews.json # Mock review data
└── store/               # Zustand stores
    └── filters.ts       # Filter state management
```

## Key Features

### Authentication

- Email/password authentication via Supabase
- Protected dashboard routes
- Session management with middleware

### Dashboard

- **Stats Cards**: Total reviews, approved, pending, featured, average rating
- **Filters**: Property, source, channel, status, search, date range
- **Reviews Table**: Inline approval, featuring, and viewing
- **Sync**: Pull reviews from Hostaway API

### Review Management

- Approve/unapprove reviews
- Feature high-quality reviews
- Bulk operations
- Category ratings (cleanliness, communication, etc.)
- Source tracking (Hostaway, Google)
- Channel tracking (Airbnb, Booking.com, VRBO)

### Public Pages

- Property listing page
- Individual property pages with approved reviews
- Review cards with ratings and categories
- Sorting options (recent, rating, featured)
- Pagination

### API Integrations

- **Hostaway**: Automatic fallback to mock data when credentials not
- **Normalization**: Consistent data structure across sources

## Error Handling

The application includes comprehensive error handling for the Hostaway API integration:

### Visual Error States

1. **✅ Success (Green Alert)** - Real API data synced successfully
2. **⚠️ Warning (Yellow Alert)** - Using mock data (credentials not configured/invalid)
3. **❌ Error (Red Alert)** - Sync failed (network issues, rate limits, server errors)

### Error Types Handled

- **Configuration Errors**: Missing or invalid API credentials → Uses mock data
- **Authentication Errors**: 401/403 responses → Uses mock data with fix instructions
- **Rate Limiting**: 429 responses → Shows retry guidance
- **Network Errors**: Connection failures → Shows retry guidance
- **Server Errors**: 5xx responses → Shows retry guidance
- **Not Found**: 404 responses → Shows configuration help

### Documentation

- **User Guide**: `docs/HOSTAWAY_ERROR_HANDLING.md` - Detailed error scenarios and fixes
- **Quick Reference**: `docs/ERROR_MESSAGES_REFERENCE.md` - All error messages and troubleshooting
- **Implementation**: `docs/ERROR_HANDLING_SUMMARY.md` - Technical implementation details

### Testing Errors

```bash
# Test: No credentials (Yellow alert with mock data)
# Comment out credentials in .env.local and restart

# Test: Invalid credentials (Yellow alert with mock data)
HOSTAWAY_CLIENT_ID=invalid_id
HOSTAWAY_CLIENT_SECRET=invalid_secret

# Test: Network error (Red alert, no mock data)
# Disconnect internet and sync

# Test: Success (Green alert with real data)
# Set correct credentials and sync
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

| Variable                        | Required | Description                                       |
| ------------------------------- | -------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous key                            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes      | Supabase service role key (for seeding)           |
| `DATABASE_URL`                  | Yes      | PostgreSQL connection string                      |
| `DIRECT_URL`                    | Yes      | Direct PostgreSQL connection (for migrations)     |
| `HOSTAWAY_API_KEY`              | Yes      | Hostaway API key (uses mock data if not provided) |
| `HOSTAWAY_ACCOUNT_ID`           | Yes      | Hostaway account ID                               |

## Mock Data

The application includes mock review data in `public/mock-reviews.json` that is used when:

- Hostaway API credentials are not configured
- During development and testing
- For seeding the database

## Next Steps

1. **Set up Supabase project** and update environment variables
2. **Configure API integrations** (Hostaway)
3. **Customize branding** and styling
4. **Add more properties** via Prisma Studio or seed script
5. **Deploy** to Vercel or your preferred platform

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Ensure your platform supports:

- Node.js 18+
- PostgreSQL database
- Environment variables

---

## Technical Documentation

### Architecture & Design Decisions

#### Server-First Architecture with Type Safety

The application uses **next-safe-action** as the primary data mutation and fetching mechanism, providing:

- **Type-safe server actions** with automatic input validation via Zod schemas
- **Two-tier action clients**:
  - `actionClient`: Base client for public actions (login, signup)
  - `authActionClient`: Authenticated client with session validation middleware

**Authentication Middleware**:
```typescript
// lib/safe-action.ts
export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    throw new ActionError("Unauthorized: Please log in");
  }

  return next({
    ctx: { userId: userData.user.id, userEmail: userData.user.email, session }
  });
});
```

**Benefits**:
- Centralized authentication logic
- Automatic error handling with custom error messages
- Type-safe context passing to all authenticated actions
- Flattened validation errors for better UX

#### Database Schema Design

**Property-Review Relationship**:
- One-to-many relationship (Property → Reviews)
- Composite unique constraint on `(source, externalId)` prevents duplicate reviews from same source
- Strategic indexes on `(propertyId, approved)` and `rating` for optimized queries

**Review Source Abstraction**:
- `source` field supports multiple platforms ('hostaway', 'google')
- `externalId` stores original platform review ID
- `channel` field tracks booking platform (Airbnb, Booking.com, VRBO)
- Flexible schema accommodates different rating systems (1-10 scale)

**Manager Controls**:
- `approved`: Boolean flag for review moderation
- `featured`: Highlights exceptional reviews (auto-set for rating ≥ 9.5)
- `displayOrder`: Optional manual ordering for featured reviews

#### Auto-Approval Logic

Reviews are automatically processed during sync:
```typescript
// actions/reviews/sync-reviews.ts
await prisma.review.create({
  data: {
    ...reviewData,
    approved: (reviewData.rating || 0) >= 8,    // Auto-approve 8+ ratings
    featured: (reviewData.rating || 0) >= 9.5,  // Auto-feature 9.5+ ratings
  },
});
```

**Rationale**: Reduces manual moderation workload while maintaining quality control.

#### Dual Authentication System

**Supabase Auth + Prisma User Model**:
- Supabase handles authentication (sessions, tokens, password hashing)
- Prisma User model stores application-specific data (name, role)
- User IDs synchronized between both systems during signup

**Benefits**:
- Leverages Supabase's security features
- Maintains application data ownership
- Enables role-based access control (manager, admin)

#### Client-Side State Management

**Zustand for Filter State**:
- Lightweight store for dashboard filters (property, source, channel, date range)
- Automatic page reset on filter changes
- Persists filter state during navigation within dashboard

**Why not React Context?**
- Better performance (no unnecessary re-renders)
- Simpler API for complex state updates
- No provider wrapper needed

#### Cache Revalidation Strategy

Uses Next.js `revalidatePath` for surgical cache updates:
```typescript
revalidatePath("/dashboard");                           // Refresh dashboard data
revalidatePath(`/properties/${review.property.slug}`);  // Refresh specific property page
```

**Ensures**:
- Dashboard shows latest review states after approval/featuring
- Public property pages reflect approved reviews immediately
- No full-page reloads required


---

### API Behaviors

#### Hostaway API Integration

**Authentication Flow**:
1. OAuth 2.0 client credentials grant
2. Token caching with expiry tracking
3. Automatic token refresh on expiration

**Error Handling System**:

The application implements comprehensive error handling for Hostaway API integration with specific error types and user-friendly messages:

**Error Types**:
- `CREDENTIALS_NOT_CONFIGURED` - API credentials missing from environment
- `INVALID_CREDENTIALS` - Wrong Client ID or Client Secret
- `AUTH_FAILED` - Authentication failed (403 Forbidden)
- `TOKEN_EXPIRED` - Access token needs refresh
- `RATE_LIMIT_EXCEEDED` - API rate limit hit (429)
- `LISTING_NOT_FOUND` - Property listing doesn't exist (404)
- `API_REQUEST_FAILED` - General API errors (500, 502, 503, 504)
- `NETWORK_ERROR` - Connection issues
- `TIMEOUT` - Request timeout
- `INVALID_RESPONSE` - Malformed API response

**Error Handling Flow**:
```typescript
try {
  const reviews = await hostawayClient.getReviews({ listingId });
  // Success - use real data
} catch (error) {
  if (error instanceof HostawayError) {
    if (error.shouldUseMockData()) {
      // Use mock data for development/testing
      const reviews = hostawayClient.getMockReviews({ listingId });
    } else {
      // Show user-friendly error message
      throw new Error(error.getUserMessage());
    }
  }
}
```

**Frontend Error Display**:

1. **Success (Green)**: Real API data synced successfully
2. **Warning (Yellow)**: Using mock data due to missing/invalid credentials
3. **Error (Red)**: API failure with specific error message

**Graceful Degradation**:
```typescript
// lib/hostaway/client.ts
if (!this.clientId || !this.clientSecret) {
  throw new HostawayError(
    HostawayErrorType.CREDENTIALS_NOT_CONFIGURED,
    "Hostaway API credentials not configured",
    { usingMockData: true }
  );
}
```

**Fallback Hierarchy**:
1. Live Hostaway API (if credentials configured and valid)
2. Mock data from `public/mock-reviews.json` (if credentials missing/invalid)
3. Error message (for network/server errors)

**Review Normalization**:
- Converts Hostaway-specific fields to unified schema
- Handles optional category ratings (cleanliness, communication, etc.)
- Preserves original review ID for deduplication

**Error Messages Examples**:

| Scenario | Error Type | User Message | Action |
|----------|-----------|--------------|--------|
| No credentials in .env | `CREDENTIALS_NOT_CONFIGURED` | "Hostaway API credentials are not configured. Using mock data for development." | Uses mock data |
| Wrong Client ID/Secret | `INVALID_CREDENTIALS` | "Invalid Hostaway API credentials. Please check your Client ID and Client Secret." | Uses mock data |
| Network down | `NETWORK_ERROR` | "Network error while connecting to Hostaway API. Please check your internet connection." | Shows error, can retry |
| Rate limit hit | `RATE_LIMIT_EXCEEDED` | "Hostaway API rate limit exceeded. Please try again later." | Shows error, can retry |
| Server error | `API_REQUEST_FAILED` | "Hostaway API request failed (Status: 500). Hostaway server error - please try again later." | Shows error, can retry |

#### Review Sync Behavior

**Upsert Logic**:
```typescript
const existing = await prisma.review.findUnique({
  where: { source_externalId: { source: "hostaway", externalId: "12345" } }
});

if (existing) {
  // Update existing review (preserves manager controls)
  await prisma.review.update({ ... });
} else {
  // Create new review with auto-approval logic
  await prisma.review.create({ ... });
}
```

**Prevents**:
- Duplicate reviews from same source
- Overwriting manual approval/featured flags
- Data loss during re-syncs

**Returns**:
```json
{
  "success": true,
  "summary": {
    "new": 5,
    "updated": 2,
    "errors": 0,
    "total": 7
  }
}
```

#### Review Filtering & Pagination

**Server-Side Filtering**:
- Property, source, channel, approval status, featured status
- Rating range (min/max)
- Date range (submission date)
- Full-text search (guest name, review text)

**Sorting Options**:
- By date (newest/oldest)
- By rating (highest/lowest)
- By property name (A-Z/Z-A)

**Pagination**:
- Default: 20 reviews per page
- Configurable limit (1-100)
- Returns total count for pagination UI

#### Statistics Aggregation

**Real-time Stats**:
- Total reviews, approved, pending, featured counts
- Average overall rating
- Average category ratings (cleanliness, communication, etc.)
- Reviews grouped by source (Hostaway, Google)
- Reviews grouped by channel (Airbnb, Booking.com, VRBO)

**Filtering Support**:
- Stats can be filtered by property, date range
- Enables property-specific and time-based analytics


---

### Google Reviews Integration

#### Current Implementation Status

**Schema Support**: ✅ **Implemented**
- Database schema includes `googlePlaceId` field in Property model
- Review source enum includes 'google' option
- Filter UI includes Google as a source option

**API Integration**: ❌ **Not Implemented**

#### Analysis

**What's Ready**:
1. Database can store Google reviews (via `source: 'google'`)
2. Property model links to Google Places via `googlePlaceId`
3. UI filters support Google source selection
4. Review normalization architecture supports multiple sources

**What's Missing**:
1. No Google Places API client implementation
2. No Google-specific normalizer function
3. No action to fetch Google reviews
4. No Google API credentials in environment variables

#### Implementation Path (Future)

To add Google Reviews integration:

1. **Add Google Places API credentials**:
   ```env
   GOOGLE_PLACES_API_KEY=your_api_key
   ```

2. **Create Google client** (`lib/google/client.ts`):
   - Fetch reviews via Places API
   - Handle pagination (Google returns max 5 reviews per request)
   - Map Google's 1-5 rating scale to 1-10 scale

3. **Create normalizer** (`lib/google/normalizer.ts`):
   - Convert Google review format to unified schema
   - Google reviews lack category ratings (cleanliness, etc.)
   - Extract author name, rating, text, timestamp

4. **Add sync action** (`actions/reviews/sync-google.ts`):
   - Similar to Hostaway sync
   - Use `googlePlaceId` to fetch reviews
   - Apply same upsert logic

#### Google API Limitations

- **Rate Limits**: 1,000 requests/day (free tier)
- **Review Count**: Maximum 5 most recent reviews per place
- **No Category Ratings**: Only overall rating (1-5 stars)
- **No Channel Info**: Can't distinguish booking platform
- **Read-Only**: Cannot respond to reviews via API

#### Recommendation

Google Reviews integration is **architecturally supported** but requires:
- Google Places API key
- Implementation of client and normalizer
- Consideration of API rate limits
- UI adjustments for missing category ratings

---

### Security Considerations

- **Server-side validation**: All inputs validated with Zod schemas
- **Authentication middleware**: Protected routes require valid session
- **SQL injection prevention**: Prisma ORM parameterizes all queries
- **XSS protection**: React auto-escapes rendered content
- **CSRF protection**: Next.js built-in protection for server actions
- **Environment variables**: Sensitive credentials never exposed to client

---

### Performance Optimizations

- **Database indexes**: Optimized queries on frequently filtered fields
- **Pagination**: Prevents loading large datasets
- **Selective revalidation**: Only affected pages refreshed after mutations
- **Connection pooling**: Prisma manages PostgreSQL connections
- **Static generation**: Public property pages can be statically generated
- **Parallel aggregations**: Stats queries run concurrently with `Promise.all`

---
