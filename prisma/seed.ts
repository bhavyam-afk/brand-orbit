import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log("🌱 Seeding database with hashed passwords...");

  // ---------- PASSWORDS ----------
  const creatorPassword = "creator123";
  const brandPassword = "brand123";

  const creatorHash = await hashPassword(creatorPassword);
  const brandHash = await hashPassword(brandPassword);

  // ---------- USERS ----------
  const creator1 = await prisma.user.create({
    data: {
      email: "creator1@test.com",
      username: "creator1",
      passwordHash: creatorHash,
      userType: "CREATOR",
    },
  });

  const creator2 = await prisma.user.create({
    data: {
      email: "creator2@test.com",
      username: "creator2",
      passwordHash: creatorHash,
      userType: "CREATOR",
    },
  });

  const brand1 = await prisma.user.create({
    data: {
      email: "brand1@test.com",
      username: "brand1",
      passwordHash: brandHash,
      userType: "BRAND",
    },
  });

  const brand2 = await prisma.user.create({
    data: {
      email: "brand2@test.com",
      username: "brand2",
      passwordHash: brandHash,
      userType: "BRAND",
    },
  });

  const users = [creator1, creator2, brand1, brand2];

  // ---------- WALLETS ----------
  const wallets = await Promise.all(
    users.map(user =>
      prisma.wallet.create({
        data: {
          userId: user.id,
          walletType: user.userType === "CREATOR" ? "CREATOR" : "BRAND",
          currentBalance: user.userType === "BRAND" ? 50000 : 0,
          pendingBalance: 0,
        },
      })
    )
  );

  // ---------- CREATOR PROFILES ----------
  const creators = await Promise.all(
    [creator1, creator2].map((user, i) =>
      prisma.creatorProfile.create({
        data: {
          userId: user.id,
          username: user.username,
          category: i === 0 ? "NANO" : "MACRO",
          nicheTags: ["tech", "fitness"],
          walletId: wallets.find(w => w.userId === user.id)!.id,
        },
      })
    )
  );

  // ---------- BRAND PROFILES ----------
  const brands = await Promise.all(
    [brand1, brand2].map(user =>
      prisma.brandProfile.create({
        data: {
          userId: user.id,
          username: user.username,
          industryTags: ["saas", "ecommerce"],
          walletId: wallets.find(w => w.userId === user.id)!.id,
        },
      })
    )
  );

  // ---------- PACKAGES ----------
  const packages = await Promise.all(
    creators.map(creator =>
      prisma.package.create({
        data: {
          creatorId: creator.id,
          title: "Instagram Reel Promo",
          mediaType: "Instagram Reel",
          deliverables: ["1 Reel", "1 Story"],
          deliveryTimeDays: 7,
          price: 5000,
          packagestatus: "ACTIVE",
        },
      })
    )
  );

  // ---------- CAMPAIGNS ----------
  const campaigns = await Promise.all(
    brands.map(brand =>
      prisma.campaign.create({
        data: {
          brandId: brand.id,
          name: "Launch Campaign",
          budget: 30000,
          creators: [],
          campaignstatus: "ACTIVE",
        },
      })
    )
  );

  // ---------- COLLABORATIONS ----------
  const collabs = [];

  // Package collabs
  for (let i = 0; i < creators.length; i++) {
    collabs.push(
      await prisma.collaboration.create({
        data: {
          creatorId: creators[i].id,
          brandId: brands[i % brands.length].id,
          packageId: packages[i].id,
          packageTitle: packages[i].title,
          collabType: "PACKAGE",
          collabstatus: i % 2 === 0 ? "ACTIVE" : "COMPLETED",
        },
      })
    );
  }

  // Campaign collab
  collabs.push(
    await prisma.collaboration.create({
      data: {
        creatorId: creators[0].id,
        brandId: brands[0].id,
        packageId: packages[0].id,
        packageTitle: packages[0].title,
        campaignId: campaigns[0].id,
        collabType: "CAMPAIGN",
        collabstatus: "ACTIVE",
      },
    })
  );

  // ---------- PACKAGE COLLABORATIONS ----------
  for (const collab of collabs.filter(c => c.collabType === "PACKAGE")) {
    await prisma.packageCollaboration.create({
      data: {
        collabId: collab.id,
        packageId: collab.packageId,
        contentStatus: "APPROVED",
        contentDraft: { files: ["draft.mp4"] },
        draftSubmittedAt: new Date(),
        publishedContentUrl: "https://instagram.com/p/demo",
        publishedAt: new Date(),
      },
    });
  }

  // ---------- CAMPAIGN COLLABORATION ----------
  await prisma.campaignCollaboration.create({
    data: {
      collabId: collabs.find(c => c.collabType === "CAMPAIGN")!.id,
      campaignId: campaigns[0].id,
      scope: { reels: 2, stories: 3 },
      contentStatus: "UNDER_REVIEW",
    },
  });

  // ---------- TRANSACTIONS ----------
  for (const collab of collabs) {
    const brandWallet = wallets.find(w => w.walletType === "BRAND")!;
    const creatorWallet = wallets.find(w => w.walletType === "CREATOR")!;

    await prisma.transaction.create({
      data: {
        fromWalletId: brandWallet.id,
        toWalletId: creatorWallet.id,
        amount: 5000,
        type: "PAYMENT",
        status: collab.collabstatus === "COMPLETED" ? "COMPLETED" : "PENDING",
        collabId: collab.id,
      },
    });

    await prisma.transaction.create({
      data: {
        fromWalletId: creatorWallet.id,
        toWalletId: brandWallet.id,
        amount: 500,
        type: "FEE",
        status: "COMPLETED",
        collabId: collab.id,
      },
    });
  }

  console.log("✅ Seed completed with bcrypt-hashed passwords");
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
