import { PrismaClient, UserType, CreatorCategory, CollabStatus, TransactionType, TransactionStatus, PackageStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  /* -------------------------
     CLEAN DATABASE (OPTIONAL)
  -------------------------- */
  await prisma.transaction.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.package.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.brandProfile.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  /* -------------------------
     CREATE BRANDS
  -------------------------- */
  const brandUsers = await Promise.all(
    ["nike", "spotify", "zomato"].map((name) =>
      prisma.user.create({
        data: {
          email: `${name}@brand.com`,
          username: name,
          passwordHash: "hashed-password",
          userType: UserType.BRAND,
          brandProfile: {
            create: {
              username: name,
              bio: `${name} official brand`,
              industryTags: ["marketing", "ads"],
              logoUrl: `https://logo.com/${name}.png`,
            },
          },
          wallet: {
            create: {
              currentBalance: 50000,
            },
          },
        },
        include: { brandProfile: true, wallet: true },
      })
    )
  );

  /* -------------------------
     CREATE CAMPAIGNS
  -------------------------- */
  const campaigns = await Promise.all(
    brandUsers.map((brand, index) =>
      prisma.campaign.create({
        data: {
          name: `${brand.username}-launch-campaign`,
          brandId: brand.brandProfile!.id,
          budget: 20000 + index * 5000,
        },
      })
    )
  );

  /* -------------------------
     CREATE CREATORS
  -------------------------- */
  const creatorUsers = await Promise.all(
    ["alice", "bob", "charlie"].map((name) =>
      prisma.user.create({
        data: {
          email: `${name}@creator.com`,
          username: name,
          passwordHash: "hashed-password",
          userType: UserType.CREATOR,
          creatorProfile: {
            create: {
              username: name,
              bio: `${name} is a lifestyle creator`,
              niche: "Lifestyle",
              nicheTags: ["fashion", "travel"],
              category: CreatorCategory.MICRO,
              follower_count: 25000,
            },
          },
          wallet: {
            create: {
              currentBalance: 0,
              pendingBalance: 0,
            },
          },
        },
        include: { creatorProfile: true, wallet: true },
      })
    )
  );

  /* -------------------------
     CREATE PACKAGES
  -------------------------- */
  const packages = [];
  for (const creator of creatorUsers) {
    const pkg = await prisma.package.create({
      data: {
        creatorId: creator.creatorProfile!.id,
        title: "Instagram Reel + Story",
        description: "1 reel + 2 stories",
        mediaType: "Instagram",
        deliverables: ["1 Reel", "2 Stories"],
        deliveryTimeDays: 7,
        price: 5000,
        status: PackageStatus.ACTIVE,
      },
    });
    packages.push(pkg);
  }

  /* -------------------------
     CREATE COLLABORATIONS
  -------------------------- */
  const collaborations = [];
  for (let i = 0; i < creatorUsers.length; i++) {
    const creator = creatorUsers[i];
    const brand = brandUsers[i % brandUsers.length];
    const campaign = campaigns[i % campaigns.length];
    const pkg = packages[i];

    const collab = await prisma.collaboration.create({
      data: {
        creatorId: creator.creatorProfile!.id,
        creatorName: creator.creatorProfile!.username,
        brandId: brand.brandProfile!.id,
        brandName: brand.brandProfile!.username,
        packageId: pkg.id,
        packageTitle: pkg.title,
        campaignId: campaign.id,
        finalCost: pkg.price,
        status: CollabStatus.COMPLETED,
        reportedReach: 120000,
        reportedEngagement: 8200,
      },
    });

    collaborations.push(collab);
  }

  /* -------------------------
     CREATE TRANSACTIONS
  -------------------------- */
  for (let i = 0; i < collaborations.length; i++) {
    const collab = collaborations[i];
    const creator = creatorUsers[i];
    const brand = brandUsers[i];

    // Brand pays
    await prisma.transaction.create({
      data: {
        userId: brand.id,
        walletId: brand.wallet!.id,
        creatorId: creator.creatorProfile!.id,
        amount: collab.finalCost,
        type: TransactionType.PAYMENT,
        status: TransactionStatus.COMPLETED,
        collabId: collab.id,
      },
    });

    // Creator receives payout
    await prisma.transaction.create({
      data: {
        userId: creator.id,
        walletId: creator.wallet!.id,
        creatorId: creator.creatorProfile!.id,
        amount: collab.finalCost,
        type: TransactionType.PAYOUT,
        status: TransactionStatus.COMPLETED,
        collabId: collab.id,
      },
    });
  }

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
