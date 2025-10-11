import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import mockReviews from "../public/mock-reviews.json";

const prisma = new PrismaClient();

// Initialize Supabase Admin client for user creation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials!");
  console.error("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log("🌱 Starting database seed...");

  // Create properties
  const properties = [
    {
      name: "Downtown Luxury Loft",
      slug: "downtown-luxury-loft",
      address: "123 Main St, New York, NY 10001",
      hostaway_id: 12345,
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      description:
        "Modern luxury loft in the heart of downtown. Perfect for business travelers and couples.",
    },
    {
      name: "Beachfront Paradise Villa",
      slug: "beachfront-paradise-villa",
      address: "456 Ocean Drive, Miami, FL 33139",
      hostaway_id: 12346,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      description:
        "Stunning beachfront villa with panoramic ocean views. Ideal for families and groups.",
    },
    {
      name: "Mountain View Cabin",
      slug: "mountain-view-cabin",
      address: "789 Pine Ridge Rd, Aspen, CO 81611",
      hostaway_id: 12347,
      imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
      description:
        "Cozy cabin with breathtaking mountain views. Perfect for ski trips and nature lovers.",
    },
    {
      name: "Urban Studio Apartment",
      slug: "urban-studio-apartment",
      address: "321 Market St, San Francisco, CA 94102",
      hostaway_id: 12348,
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      description:
        "Compact and stylish studio in the city center. Great for solo travelers.",
    },
    {
      name: "Historic Townhouse",
      slug: "historic-townhouse",
      address: "654 Heritage Lane, Boston, MA 02108",
      hostaway_id: 12349,
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      description:
        "Beautifully restored townhouse with modern amenities. Experience history with comfort.",
    },
  ];

  console.log("Creating properties...");
  const createdProperties = await Promise.all(
    properties.map((property) =>
      prisma.property.upsert({
        where: { slug: property.slug },
        update: property,
        create: property,
      })
    )
  );
  console.log(`✅ Created ${createdProperties.length} properties`);

  // Map Hostaway listing IDs to property IDs
  const listingToPropertyMap = new Map(
    createdProperties.map((p) => [p.hostaway_id, p.id])
  );

  // Create reviews from mock data
  console.log("Creating reviews...");
  let reviewCount = 0;

  for (const mockReview of mockReviews.reviews) {
    const propertyId = listingToPropertyMap.get(mockReview.listingId);
    if (!propertyId) {
      console.warn(`No property found for listing ID ${mockReview.listingId}`);
      continue;
    }

    await prisma.review.upsert({
      where: {
        source_externalId: {
          source: "hostaway",
          externalId: mockReview.id.toString(),
        },
      },
      update: {},
      create: {
        propertyId,
        source: "hostaway",
        externalId: mockReview.id.toString(),
        guestName: mockReview.guestName,
        rating: mockReview.rating,
        publicReview: mockReview.publicReview,
        cleanliness: mockReview.cleanliness,
        communication: mockReview.communication,
        accuracy: mockReview.accuracy,
        location: mockReview.location,
        checkin: mockReview.checkin,
        value: mockReview.value,
        respectRules: mockReview.respectRules,
        channel: mockReview.channel,
        type: mockReview.type,
        status: mockReview.status,
        submittedAt: new Date(mockReview.submittedAt),
        // Auto-approve reviews with rating >= 8
        approved: mockReview.rating >= 8,
        // Feature reviews with rating >= 9.5
        featured: mockReview.rating >= 9.5,
      },
    });
    reviewCount++;
  }
  console.log(`✅ Created ${reviewCount} reviews`);

  // Create a test manager user
  console.log("Creating test user...");

  const testEmail = "manager@flexliving.com";
  const testPassword = "password123";
  const testName = "Test Manager";

  try {
    // First, create Supabase Auth user
    console.log("Creating Supabase Auth user...");
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: testName,
      },
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes("already registered")) {
        console.log("⚠️  Supabase Auth user already exists, skipping...");
      } else {
        throw authError;
      }
    } else {
      console.log("✅ Created Supabase Auth user");
    }

    // Then, create database user record
    console.log("Creating database user record...");
    const authUserId = authData?.user?.id;

    await prisma.user.upsert({
      where: { email: testEmail },
      update: {},
      create: {
        id: authUserId, // Use Supabase Auth user ID
        email: testEmail,
        name: testName,
        role: "manager",
      },
    });
    console.log("✅ Created database user record");
    console.log(`\n📧 Login credentials:`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}\n`);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    console.log("⚠️  You may need to create the user manually via signup page");
  }

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

