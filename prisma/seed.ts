import { PrismaClient, UserType, TransactionType, TransactionStatus, CreatorCategory, CollabStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function monthsAgo(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}

async function main() {
  console.log("🌱 Seeding database...");

  // ---------- USERS ----------
  const password = await bcrypt.hash("password123", 10);

  const creators = await Promise.all(
    ["alice", "bob", "charlie"].map(username =>
      prisma.user.create({
        data: {
          email: `${username}@mail.com`,
          username,
          passwordHash: password,
          userType: UserType.CREATOR,
          creatorProfile: {
            create: {
              username,
              category: CreatorCategory.MICRO,
              niche: "Tech",
              nicheTags: ["tech", "ai", "coding"],
            },
          },
          wallet: { create: {} },
        },
        include: { creatorProfile: true, wallet: true },
      })
    )
  );

  const brands = await Promise.all(
    ["nike", "adidas"].map(username =>
      prisma.user.create({
        data: {
          email: `${username}@brand.com`,
          username,
          passwordHash: password,
          userType: UserType.BRAND,
          brandProfile: {
            create: {
              username,
              industryTags: ["fashion", "sports"],
            },
          },
          wallet: { create: {} },
        },
        include: { brandProfile: true, wallet: true },
      })
    )
  );

  // ---------- CAMPAIGNS ----------
  const campaign = await prisma.campaign.create({
    data: {
      brandId: brands[0].brandProfile!.id,
      name: "Winter Campaign",
      budget: 50000,
      startDate: monthsAgo(4),
    },
  });

  // ---------- PACKAGES ----------
  const packages = await Promise.all(
    creators.map(c =>
      prisma.package.create({
        data: {
          creatorId: c.creatorProfile!.id,
          title: "Instagram Reel",
          mediaType: "Instagram",
          deliverables: ["1 Reel"],
          deliveryTimeDays: 7,
          price: 5000,
        },
      })
    )
  );

  // ---------- COLLABORATIONS ----------
  const collaborations = await Promise.all(
    creators.map((c, i) =>
      prisma.collaboration.create({
        data: {
          creatorId: c.creatorProfile!.id,
          brandId: brands[0].brandProfile!.id,
          packageId: packages[i].id,
          campaignId: campaign.id,
          finalCost: 5000,
          status: CollabStatus.COMPLETED,
        },
      })
    )
  );

  // ---------- TRANSACTIONS (SPREAD ACROSS MONTHS) ----------
  for (let i = 0; i < creators.length; i++) {
    const creator = creators[i];
    const collab = collaborations[i];

    for (let m = 0; m < 5; m++) {
      await prisma.transaction.create({
        data: {
          creatorId: creator.creatorProfile!.id,
          walletId: creator.wallet!.id,
          userId: creator.id,
          amount: 1000 + m * 500,
          type: TransactionType.PAYOUT,
          status: TransactionStatus.COMPLETED,
          createdAt: monthsAgo(m),
        },
      });
    }
  }

  // ---------- FOLLOWER SNAPSHOTS ----------
  for (const creator of creators) {
    let followers = 1000;

    for (let m = 5; m >= 0; m--) {
      followers += Math.floor(Math.random() * 300);

      await prisma.creatorFollowerSnapshot.create({
        data: {
          creatorId: creator.creatorProfile!.id,
          followers,
          recordedAt: monthsAgo(m),
        },
      });
    }
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
