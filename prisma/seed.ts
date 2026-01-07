import { Prisma, PrismaClient, UserType, CreatorCategory, CollabStatus, TransactionType, TransactionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const monthsAgo = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
};

async function main() {
  console.log("🌱 Seeding database...");

  // ─────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────
  const password = await bcrypt.hash("password123", 10);

  const creators = await Promise.all(
    ["alice", "bob", "charlie"].map((username, i) =>
      prisma.user.create({
        data: {
          email: `${username}@mail.com`,
          username,
          passwordHash: password,
          userType: UserType.CREATOR,
          creatorProfile: {
            create: {
              username,
              bio: `${username} is a lifestyle creator`,
              niche: "Lifestyle",
              nicheTags: ["fashion", "travel"],
              category: [CreatorCategory.NANO, CreatorCategory.MICRO, CreatorCategory.MACRO][i],
              follower_count: 2000 * (i + 1),
            },
          },
          wallet: { create: {} },
        },
        include: { creatorProfile: true, wallet: true },
      })
    )
  );

  const brands = await Promise.all(
    ["nike", "adidas"].map((username) =>
      prisma.user.create({
        data: {
          email: `${username}@brand.com`,
          username,
          passwordHash: password,
          userType: UserType.BRAND,
          brandProfile: {
            create: {
              username,
              bio: `${username} official brand`,
              industryTags: ["fashion", "sports"],
            },
          },
          wallet: { create: {} },
        },
        include: { brandProfile: true, wallet: true },
      })
    )
  );

  // ─────────────────────────────────────────────
  // COLLABORATIONS + TRANSACTIONS
  // ─────────────────────────────────────────────
  for (let month = 5; month >= 0; month--) {
    for (const creator of creators) {
      const brand = brands[month % brands.length];

      const collab = await prisma.collaboration.create({
        data: {
          creatorId: creator.creatorProfile!.id,
          brandId: brand.brandProfile!.id,
          brandName: brand.username,
          packageId: "dummy", // placeholder
          finalCost: 500 + month * 100,
          status: CollabStatus.COMPLETED,
          createdAt: monthsAgo(month),
        },
      });

      // Brand pays
      await prisma.transaction.create({
        data: {
          userId: brand.id,
          creatorId: creator.creatorProfile!.id,
          walletId: brand.wallet!.id,
          amount: collab.finalCost,
          type: TransactionType.PAYMENT,
          status: TransactionStatus.COMPLETED,
          collabId: collab.id,
          createdAt: monthsAgo(month),
        },
      });

      // Creator receives
      await prisma.transaction.create({
        data: {
          userId: creator.id,
          creatorId: creator.creatorProfile!.id,
          walletId: creator.wallet!.id,
          amount: new Prisma.Decimal(collab.finalCost).mul(0.9),
          type: TransactionType.PAYOUT,
          status: TransactionStatus.COMPLETED,
          collabId: collab.id,
          createdAt: monthsAgo(month),
        },
      });
    }
  }

  // ─────────────────────────────────────────────
  // FOLLOWER SNAPSHOTS (GROWTH)
  // ─────────────────────────────────────────────
  for (const creator of creators) {
    let followers = creator.creatorProfile!.follower_count;

    for (let month = 5; month >= 0; month--) {
      const increase = 50 + Math.floor(Math.random() * 100);
      followers += increase;

      await prisma.creatorFollowerSnapshot.create({
        data: {
          creatorId: creator.creatorProfile!.id,
          followers_increased: increase,
          recordedAt: monthsAgo(month),
        },
      });

      await prisma.creatorDailyMetrics.create({
        data: {
          creatorId: creator.creatorProfile!.id,
          date: monthsAgo(month),
          followers,
          reach: followers * 2,
          impressions: followers * 3,
          engagement: Math.floor(followers * 0.05),
        },
      });
    }
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
