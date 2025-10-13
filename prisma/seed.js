import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting PostgreSQL seeding...");

  // Clear old data (optional)
  await prisma.chatMessage.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.package.deleteMany();
  await prisma.brandProfile.deleteMany();
  await prisma.influencerProfile.deleteMany();
  await prisma.user.deleteMany();

  // USERS
  console.log("👤 Creating users...");
  const createdUsers = await prisma.user.createMany({
    data: [
      { email: "jane@brandorbit.com", passwordHash: "hashed123", role: "INFLUENCER" },
      { email: "mike@brandorbit.com", passwordHash: "hashed123", role: "INFLUENCER" },
      { email: "lisa@brandorbit.com", passwordHash: "hashed123", role: "INFLUENCER" },
      { email: "alex@techx.com", passwordHash: "hashed123", role: "BRAND" },
      { email: "sara@glowup.com", passwordHash: "hashed123", role: "BRAND" },
    ],
  });

  const influencers = await prisma.user.findMany({ where: { role: "INFLUENCER" } });
  const brands = await prisma.user.findMany({ where: { role: "BRAND" } });

  // INFLUENCER PROFILES
  console.log("💁‍♀️ Creating influencer profiles...");
  for (const [i, u] of influencers.entries()) {
    await prisma.influencerProfile.create({
      data: {
        userId: u.id,
        username: `influencer_${i + 1}`,
        bio: "Passionate content creator sharing insights.",
        niche: ["Fashion", "Tech", "Food"][i % 3],
        followersCount: 10000 + i * 5000,
        platformLinks: { instagram: `https://instagram.com/influencer_${i + 1}` },
        profilePic: `/avatars/influencer${i + 1}.png`,
        location: ["Delhi", "Mumbai", "Bangalore"][i % 3],
        rating: 4.2 + (i % 3) * 0.2,
      },
    });
  }

  const influencerProfiles = await prisma.influencerProfile.findMany();

  // BRAND PROFILES
  console.log("🏢 Creating brand profiles...");
  for (const [i, u] of brands.entries()) {
    await prisma.brandProfile.create({
      data: {
        userId: u.id,
        brandName: ["TechX", "GlowUp"][i],
        industry: ["Technology", "Beauty"][i],
        logoUrl: `/logos/brand${i + 1}.png`,
        location: ["Pune", "Delhi"][i],
        contactPerson: ["Alex", "Sara"][i],
      },
    });
  }

  const brandProfiles = await prisma.brandProfile.findMany();

  // PACKAGES
  console.log("📦 Creating packages...");
  for (const inf of influencerProfiles) {
    await prisma.package.createMany({
      data: [
        {
          influencerId: inf.id,
          title: "Instagram Story + Post",
          description: "1 story and 1 feed post",
          price: 250,
          deliveryTime: 3,
          platform: "Instagram",
          mediaType: "POST",
        },
        {
          influencerId: inf.id,
          title: "Reel Promotion",
          description: "One short-form video",
          price: 500,
          deliveryTime: 5,
          platform: "Instagram",
          mediaType: "REEL",
        },
      ],
    });
  }

  const packages = await prisma.package.findMany();

  // OFFERS + PAYMENTS + CHATS
  console.log("💸 Creating offers, payments, and chats...");
  let offerCount = 0;
  for (const brand of brandProfiles) {
    for (const pkg of packages.slice(0, 5)) {
      const offer = await prisma.offer.create({
        data: {
          brandId: brand.id,
          influencerId: pkg.influencerId,
          packageId: pkg.id,
          offerAmount: 300 + offerCount * 10,
          message: "We’d love to collaborate!",
          status: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"][offerCount % 4],
        },
      });
      offerCount++;

      await prisma.payment.create({
        data: {
          offerId: offer.id,
          brandId: brand.id,
          influencerId: pkg.influencerId,
          amount: offer.offerAmount,
          platformFee: offer.offerAmount * 0.1,
          status: ["PENDING", "SUCCESS", "FAILED"][offerCount % 3],
        },
      });

      await prisma.chatMessage.createMany({
        data: [
          {
            offerId: offer.id,
            senderId: brand.userId,
            receiverId: pkg.influencerId,
            message: "Hello! Let’s discuss details.",
          },
          {
            offerId: offer.id,
            senderId: pkg.influencerId,
            receiverId: brand.userId,
            message: "Sure! Looking forward to it.",
          },
        ],
      });
    }
  }

  console.log("✅ All tables seeded successfully!");
}

main()
  .catch((err) => console.error("❌ Seeding failed:", err))
  .finally(async () => {
    await prisma.$disconnect();
  });
