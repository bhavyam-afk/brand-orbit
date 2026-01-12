import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("🌱 Seeding database...");

  // ─────────────────────────────
  // USERS
  // ─────────────────────────────
  const creatorUser1 = await prisma.user.create({
    data: {
      email: "creator1@test.com",
      username: "creator_one",
      passwordHash: await hash("creator123"),
      userType: "CREATOR",
    },
  });

  const creatorUser2 = await prisma.user.create({
    data: {
      email: "creator2@test.com",
      username: "creator_two",
      passwordHash: await hash("creator123"),
      userType: "CREATOR",
    },
  });

  const brandUser1 = await prisma.user.create({
    data: {
      email: "brand1@test.com",
      username: "brand_one",
      passwordHash: await hash("brand123"),
      userType: "BRAND",
    },
  });

  const brandUser2 = await prisma.user.create({
    data: {
      email: "brand2@test.com",
      username: "brand_two",
      passwordHash: await hash("brand123"),
      userType: "BRAND",
    },
  });

  // ─────────────────────────────
  // WALLETS
  // ─────────────────────────────
  const creatorWallet1 = await prisma.wallet.create({
    data: {
      userId: creatorUser1.id,
      walletType: "CREATOR",
      currentBalance: 5000,
      totalEarned: 5000,
    },
  });

  const creatorWallet2 = await prisma.wallet.create({
    data: {
      userId: creatorUser2.id,
      walletType: "CREATOR",
    },
  });

  const brandWallet1 = await prisma.wallet.create({
    data: {
      userId: brandUser1.id,
      walletType: "BRAND",
      currentBalance: 20000,
      totalSpent: 10000,
    },
  });

  const brandWallet2 = await prisma.wallet.create({
    data: {
      userId: brandUser2.id,
      walletType: "BRAND",
      currentBalance: 15000,
    },
  });

  // ─────────────────────────────
  // PROFILES
  // ─────────────────────────────
  const creator1 = await prisma.creatorProfile.create({
    data: {
      userId: creatorUser1.id,
      username: "creator_one",
      bio: "Tech & Startup Creator",
      niche: "Technology",
      nicheTags: ["tech", "ai", "saas"],
      category: "MICRO",
      follower_count: 45000,
      walletId: creatorWallet1.id,
    },
  });

  const creator2 = await prisma.creatorProfile.create({
    data: {
      userId: creatorUser2.id,
      username: "creator_two",
      bio: "Lifestyle & Fitness Creator",
      niche: "Fitness",
      nicheTags: ["fitness", "health"],
      category: "NANO",
      follower_count: 8000,
      walletId: creatorWallet2.id,
    },
  });

  const brand1 = await prisma.brandProfile.create({
    data: {
      userId: brandUser1.id,
      username: "brand_one",
      bio: "AI SaaS Company",
      industryTags: ["saas", "ai"],
      walletId: brandWallet1.id,
    },
  });

  const brand2 = await prisma.brandProfile.create({
    data: {
      userId: brandUser2.id,
      username: "brand_two",
      bio: "Fitness Brand",
      industryTags: ["fitness"],
      walletId: brandWallet2.id,
    },
  });

  // ─────────────────────────────
  // PACKAGES
  // ─────────────────────────────
  const techPackage = await prisma.package.create({
    data: {
      creatorId: creator1.id,
      title: "Instagram Reel Promotion",
      description: "1 Reel + Story",
      mediaType: "Instagram Reel",
      deliverables: ["1 Reel", "1 Story"],
      deliveryTimeDays: 5,
      price: 5000,
      packagestatus: "ACTIVE",
    },
  });

  const fitnessPackage = await prisma.package.create({
    data: {
      creatorId: creator2.id,
      title: "Workout Video Shoutout",
      description: "YouTube Shorts mention",
      mediaType: "YouTube Shorts",
      deliverables: ["1 Short"],
      deliveryTimeDays: 7,
      price: 3000,
      packagestatus: "ACTIVE",
    },
  });

  // ─────────────────────────────
  // COLLABORATIONS
  // ─────────────────────────────
  const collab1 = await prisma.collaboration.create({
    data: {
      creatorId: creator1.id,
      brandId: brand1.id,
      packageId: techPackage.id,
      collabType: "PACKAGE",
      collabstatus: "ACTIVE",
    },
  });

  const collab2 = await prisma.collaboration.create({
    data: {
      creatorId: creator2.id,
      brandId: brand2.id,
      packageId: fitnessPackage.id,
      collabType: "PACKAGE",
      collabstatus: "COMPLETED",
    },
  });

  // ─────────────────────────────
  // PACKAGE COLLABORATIONS
  // ─────────────────────────────
  await prisma.packageCollaboration.create({
    data: {
      collabId: collab1.id,
      packageId: techPackage.id,
      contentStatus: "SUBMITTED",
      contentDraft: {
        fileUrls: [
          "https://cdn.test.com/drafts/tech_reel.mp4",
        ],
      },
      draftSubmittedAt: new Date(),
    },
  });

  await prisma.packageCollaboration.create({
    data: {
      collabId: collab2.id,
      packageId: fitnessPackage.id,
      contentStatus: "APPROVED",
      contentDraft: {
        fileUrls: [
          "https://cdn.test.com/drafts/fitness_short.mp4",
        ],
      },
      draftSubmittedAt: new Date(),
      draftapprovalAt: new Date(),
      publishedContentUrl: "https://instagram.com/p/test",
      publishedAt: new Date(),
    },
  });

  // ─────────────────────────────
  // TRANSACTIONS
  // ─────────────────────────────
  await prisma.transaction.createMany({
    data: [
      {
        fromWalletId: brandWallet1.id,
        toWalletId: creatorWallet1.id,
        amount: 5000,
        type: "PAYMENT",
        status: "COMPLETED",
        collabId: collab1.id,
      },
      {
        fromWalletId: creatorWallet1.id,
        toWalletId: brandWallet1.id,
        amount: 500,
        type: "FEE",
        status: "COMPLETED",
      },
    ],
  });

  // ─────────────────────────────
  // SOCIAL ACCOUNT
  // ─────────────────────────────
  await prisma.creatorSocialAccount.create({
    data: {
      creatorId: creator1.id,
      platform: "INSTAGRAM",
      accessToken: "test_long_lived_token",
      igAccountId: "123456789",
      connected: true,
    },
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
