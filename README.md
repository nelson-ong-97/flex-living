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

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript 5
- **Server Actions**: next-safe-action with Zod validation
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- (Optional) Hostaway API credentials

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

   # Hostaway API (Optional - will use mock data if not provided)
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
| `HOSTAWAY_API_KEY`              | No       | Hostaway API key (uses mock data if not provided) |
| `HOSTAWAY_ACCOUNT_ID`           | No       | Hostaway account ID                               |

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

## License

MIT
