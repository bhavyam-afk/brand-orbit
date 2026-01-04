import { PrismaClient, CollabStatus, TransactionType, TransactionStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding for existing creator: creator1");

  // ─────────────────────────────────────────────
  // 1️⃣ Fetch existing creator
  // ─────────────────────────────────────────────
  const creatorUser = await prisma.user.findUnique({
    where: { username: "creator1" },
    include: { creatorProfile: true },
  });

  if (!creatorUser || !creatorUser.creatorProfile) {
    throw new Error("❌ creator1 or CreatorProfile does not exist");
  }

  const creator = creatorUser.creatorProfile;

  // ─────────────────────────────────────────────
  // 2️⃣ Wallet (safe)
  // ─────────────────────────────────────────────
  const wallet = await prisma.wallet.upsert({
    where: { userId: creatorUser.id },
    update: {},
    create: {
      userId: creatorUser.id,
      currentBalance: new Decimal(5000),
      pendingBalance: new Decimal(2000),
      totalEarned: new Decimal(9000),
      totalWithdrawn: new Decimal(4000),
    },
  });

  // ─────────────────────────────────────────────
  // 3️⃣ Brand User (safe)
  // ─────────────────────────────────────────────
  const brandUser = await prisma.user.upsert({
    where: { username: "brand_seed" },
    update: {},
    create: {
      email: "brand_seed@test.com",
      username: "brand_seed",
      passwordHash: "hashed",
      userType: "BRAND",
    },
  });

  // ─────────────────────────────────────────────
  // 4️⃣ Brand Profile (THIS WAS FAILING — FIXED)
  // ─────────────────────────────────────────────
  const brand = await prisma.brandProfile.upsert({
    where: { userId: brandUser.id }, // UNIQUE FIELD
    update: {},
    create: {
      userId: brandUser.id,
      username: "brand_seed",
      logoUrl: "https://placehold.co/100x100",
      bio: "Seeded test brand",
      industryTags: ["tech"],
    },
  });

  // ─────────────────────────────────────────────
  // 5️⃣ Packages
  // ─────────────────────────────────────────────
  const reelPackage = await prisma.package.create({
    data: {
      creatorId: creator.id,
      title: "Instagram Reel Promo",
      description: "1 Reel + Story",
      price: new Decimal(3000),
      mediaType: "Instagram Reel",
      deliverables: ["1 Reel", "1 Story"],
      deliveryTimeDays: 7,
      status: "ACTIVE",
    },
  });

  const postPackage = await prisma.package.create({
    data: {
      creatorId: creator.id,
      title: "Instagram Post",
      description: "1 Feed Post",
      price: new Decimal(2000),
      mediaType: "Instagram Post",
      deliverables: ["1 Post"],
      deliveryTimeDays: 5,
      status: "ACTIVE",
    },
  });

  // ─────────────────────────────────────────────
  // 6️⃣ Campaign
  // ─────────────────────────────────────────────
  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      name: "Seed Campaign",
      budget: new Decimal(10000),
    },
  });

  // ─────────────────────────────────────────────
  // 7️⃣ Collaborations
  // ─────────────────────────────────────────────
  const activeCollab = await prisma.collaboration.create({
    data: {
      creatorId: creator.id,
      brandId: brand.id,
      packageId: reelPackage.id,
      campaignId: campaign.id,
      finalCost: new Decimal(3000),
      status: CollabStatus.ACTIVE,
    },
  });

  const completedCollab = await prisma.collaboration.create({
    data: {
      creatorId: creator.id,
      brandId: brand.id,
      packageId: postPackage.id,
      campaignId: campaign.id,
      finalCost: new Decimal(2000),
      status: CollabStatus.COMPLETED,
      reportedReach: 15000,
      reportedEngagement: 5,
      linksToPosts: {
        instagram: "https://instagram.com/p/seedpost",
      },
    },
  });

  await prisma.collaboration.create({
    data: {
      creatorId: creator.id,
      brandId: brand.id,
      packageId: postPackage.id,
      finalCost: new Decimal(2000),
      status: CollabStatus.PENDING,
    },
  });

  // ─────────────────────────────────────────────
  // 8️⃣ Transactions
  // ─────────────────────────────────────────────
  await prisma.transaction.createMany({
    data: [
      {
        creatorId: creator.id,
        walletId: wallet.id,
        userId: creatorUser.id,
        amount: new Decimal(2000),
        type: TransactionType.PAYOUT,
        status: TransactionStatus.COMPLETED,
        collabId: completedCollab.id,
      },
      {
        creatorId: creator.id,
        walletId: wallet.id,
        userId: creatorUser.id,
        amount: new Decimal(3000),
        type: TransactionType.PAYMENT,
        status: TransactionStatus.PENDING,
        collabId: activeCollab.id,
      },
    ],
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
