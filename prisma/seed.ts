import { PrismaClient, WalletType, TransactionType, TransactionStatus, UserType, CollabStatus, contentStatus, CollabType, PackageStatus, CreatorCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

 await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();

  // Content & collaboration
  await prisma.packageCollaboration.deleteMany();
  await prisma.campaignCollaboration.deleteMany();
  await prisma.report.deleteMany();
  await prisma.collaboration.deleteMany();

  // Packages & campaigns
  await prisma.package.deleteMany();
  await prisma.campaign.deleteMany();

  // Creator dependent tables
  await prisma.creatorAvailability.deleteMany();
  await prisma.creatorDailyMetrics.deleteMany();
  await prisma.creatorFollowerSnapshot.deleteMany();
  await prisma.creatorSocialAccount.deleteMany();
  await prisma.creatorSocialRawSnapshot.deleteMany();

  // Profiles
  await prisma.creatorProfile.deleteMany();
  await prisma.brandProfile.deleteMany();

  // Core users
  await prisma.user.deleteMany();

  /* -------------------------------------------------
   * PLATFORM WALLET
   * ------------------------------------------------- */
  const platformUser = await prisma.user.create({
    data: {
      email: "platform@brandorbit.com",
      username: "platform",
      passwordHash: await bcrypt.hash("password", 10),
      userType: UserType.BRAND,
    },
  });

  const platformWallet = await prisma.wallet.create({
    data: {
      userId: platformUser.id,
      walletType: WalletType.PLATFORM,
    },
  });

  /* -------------------------------------------------
   * BRAND
   * ------------------------------------------------- */
  const brandUser = await prisma.user.create({
    data: {
      email: "brand@test.com",
      username: "testbrand",
      passwordHash: await bcrypt.hash("password", 10),
      userType: UserType.BRAND,
    },
  });

  const brandWallet = await prisma.wallet.create({
    data: {
      userId: brandUser.id,
      walletType: WalletType.BRAND,
    },
  });

  const brandProfile = await prisma.brandProfile.create({
    data: {
      userId: brandUser.id,
      username: "testbrand",
      walletId: brandWallet.id,
      industryTags: ["fashion", "lifestyle"],
    },
  });

  /* -------------------------------------------------
   * CREATOR
   * ------------------------------------------------- */
  const creatorUser = await prisma.user.create({
    data: {
      email: "creator@test.com",
      username: "testcreator",
      passwordHash: await bcrypt.hash("password", 10),
      userType: UserType.CREATOR,
    },
  });

  const creatorWallet = await prisma.wallet.create({
    data: {
      userId: creatorUser.id,
      walletType: WalletType.CREATOR,
    },
  });

  const creatorProfile = await prisma.creatorProfile.create({
    data: {
      userId: creatorUser.id,
      username: "testcreator",
      walletId: creatorWallet.id,
      category: CreatorCategory.MICRO,
      nicheTags: ["fitness", "reels"],
    },
  });

  /* -------------------------------------------------
   * PACKAGE
   * ------------------------------------------------- */
  const pkg = await prisma.package.create({
    data: {
      creatorId: creatorProfile.id,
      title: "Instagram Reel Promotion",
      mediaType: "Instagram Reel",
      deliverables: ["1 Reel"],
      deliveryTimeDays: 7,
      price: 10000,
      packagestatus: PackageStatus.ACTIVE,
    },
  });

  /* -------------------------------------------------
   * COLLABORATION
   * ------------------------------------------------- */
  const collab = await prisma.collaboration.create({
    data: {
      creatorId: creatorProfile.id,
      brandId: brandProfile.id,
      packageId: pkg.id,
      collabType: CollabType.PACKAGE,
      collabstatus: CollabStatus.ACTIVE,
    },
  });

  await prisma.packageCollaboration.create({
    data: {
      collabId: collab.id,
      packageId: pkg.id,
      contentStatus: contentStatus.APPROVED,
      draftSubmittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      draftapprovalAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      publishedContentUrl: "https://instagram.com/p/testpost",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  /* -------------------------------------------------
   * ESCROW PAYMENT SIMULATION
   * ------------------------------------------------- */
  const totalAmount = 10000;
  const platformFee = 1000;
  const creatorAmount = 9000;

  // BRAND → PLATFORM (external payment)
  await prisma.transaction.create({
    data: {
      type: TransactionType.BRAND_PAYMENT,
      status: TransactionStatus.COMPLETED,
      amount: totalAmount,
      toWalletId: platformWallet.id,
      collabId: collab.id,
      provider: "RAZORPAY",
      externalPaymentId: "pay_test_123",
      externalOrderId: "order_test_123",
    },
  });

  // PLATFORM → CREATOR (escrow credit, pending)
  await prisma.transaction.create({
    data: {
      type: TransactionType.CREATOR_EARNING,
      status: TransactionStatus.PENDING,
      amount: creatorAmount,
      fromWalletId: platformWallet.id,
      toWalletId: creatorWallet.id,
      collabId: collab.id,
    },
  });

  // PLATFORM FEE (revenue)
  await prisma.transaction.create({
    data: {
      type: TransactionType.PLATFORM_FEE,
      status: TransactionStatus.COMPLETED,
      amount: platformFee,
      fromWalletId: platformWallet.id,
      toWalletId: platformWallet.id,
      collabId: collab.id,
    },
  });

  // Update wallet balances (as escrow would)
  await prisma.wallet.update({
    where: { id: creatorWallet.id },
    data: {
      pendingBalance: creatorAmount,
      totalEarned: creatorAmount,
    },
  });

  await prisma.wallet.update({
    where: { id: platformWallet.id },
    data: {
      totalEarned: platformFee,
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
