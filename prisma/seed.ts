import { PrismaClient, UserType, WalletType, PackageStatus, CollabStatus, CollabType, TransactionType, TransactionStatus, CreatorCategory, SubscriptionPlan, SubscriptionStatus, contentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---------------------------
  // PLATFORM WALLET
  // ---------------------------
  const platformUser = await prisma.user.create({
    data: {
      email: "platform@brandorbit.com",
      username: "brandorbit",
      passwordHash: await bcrypt.hash("admin123", 10),
      userType: UserType.BRAND,
      wallet: {
        create: {
          walletType: WalletType.PLATFORM,
          currentBalance: 0,
          pendingBalance: 0,
          totalEarned: 0,
          totalSpent: 0,
        },
      },
    },
  });

  const platformWallet = await prisma.wallet.findUnique({
    where: { userId: platformUser.id },
  });

  // ---------------------------
  // CREATORS
  // ---------------------------
  const creators = await Promise.all(
    ["alice", "bob"].map(async (name, idx) => {
      const user = await prisma.user.create({
        data: {
          email: `${name}@creator.com`,
          username: name,
          passwordHash: await bcrypt.hash("password123", 10),
          userType: UserType.CREATOR,
          wallet: {
            create: {
              walletType: WalletType.CREATOR,
              currentBalance: 0,
              pendingBalance: 0,
              totalEarned: 0,
              totalSpent: 0,
            },
          },
          creatorProfile: {
            create: {
              username: name,
              bio: `${name} is a professional content creator`,
              location: "India",
              niche: "Tech",
              nicheTags: ["tech", "reviews", "shorts"],
              profilePicUrl: "https://picsum.photos/200",
              introClipUrl: "https://example.com/intro.mp4",
              portfolio: [{ title: "Sample Work", url: "https://instagram.com" }],
              mlScore: 0.78 + idx * 0.05,
              category: CreatorCategory.MICRO,
              platformLinks: [{ platform: "instagram", url: "https://instagram.com" }],
              follower_count: 12000 + idx * 5000,
            },
          },
        },
        include: { creatorProfile: true },
      });

      return user.creatorProfile!;
    })
  );

  // ---------------------------
  // BRANDS
  // ---------------------------
  const brands = await Promise.all(
    ["nike", "apple"].map(async (name, idx) => {
      const user = await prisma.user.create({
        data: {
          email: `${name}@brand.com`,
          username: name,
          passwordHash: await bcrypt.hash("password123", 10),
          userType: UserType.BRAND,
          wallet: {
            create: {
              walletType: WalletType.BRAND,
              currentBalance: 50000,
              pendingBalance: 0,
              totalEarned: 0,
              totalSpent: 0,
            },
          },
          brandProfile: {
            create: {
              username: name,
              logoUrl: "https://picsum.photos/100",
              bio: `${name} is a global brand`,
              industryTags: ["fashion", "tech"],
              socialLinks: [{ platform: "website", url: "https://example.com" }],
              plan: idx === 0 ? SubscriptionPlan.PRO : SubscriptionPlan.BUSINESS,
              subscription: {
                create: {
                  plan: idx === 0 ? SubscriptionPlan.PRO : SubscriptionPlan.BUSINESS,
                  status: SubscriptionStatus.ACTIVE,
                  currentPeriodStart: new Date(),
                  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        },
        include: { brandProfile: true },
      });

      return user.brandProfile!;
    })
  );

  // ---------------------------
  // PACKAGES
  // ---------------------------
  const packages = await Promise.all(
    creators.map((creator, idx) =>
      prisma.package.create({
        data: {
          creatorId: creator.id,
          title: `Instagram Reel by ${creator.username}`,
          description: "High quality reel with brand mention",
          thumbnailUrl: "https://picsum.photos/300",
          mediaType: "Instagram Reel",
          deliverables: ["1 Reel", "1 Story"],
          deliveryTimeDays: 5,
          price: 5000 + idx * 2000,
          packagestatus: PackageStatus.ACTIVE,
        },
      })
    )
  );

  // ---------------------------
  // COLLABORATIONS + PACKAGE COLLAB
  // ---------------------------
  const collabs = await Promise.all(
    packages.map((pkg, idx) =>
      prisma.collaboration.create({
        data: {
          creatorId: pkg.creatorId,
          brandId: brands[idx % brands.length].id,
          packageId: pkg.id,
          collabType: CollabType.PACKAGE,
          collabstatus: CollabStatus.COMPLETED,
          packageCollaborations: {
            create: {
              packageId: pkg.id,
              contentStatus: contentStatus.APPROVED,
              contentDraft: {
                fileUrls: ["https://example.com/draft.mp4"],
                description: "Draft submitted",
              },
              draftSubmittedAt: new Date(),
              draftapprovalAt: new Date(),
              publishedContentUrl: "https://instagram.com/p/xyz",
              publishedAt: new Date(),
              brandFeedback: "Looks great!",
            },
          },
        },
      })
    )
  );

  // ---------------------------
  // TRANSACTIONS
  // ---------------------------
  for (let i = 0; i < collabs.length; i++) {
    const collab = collabs[i];
    const pkg = packages[i];
    const creatorWallet = await prisma.wallet.findFirst({ where: { creatorProfile: { id: collab.creatorId } } });
    const brandWallet = await prisma.wallet.findFirst({ where: { brandProfile: { id: collab.brandId } } });

    if (!creatorWallet || !brandWallet || !platformWallet) continue;

    // Brand pays platform
    await prisma.transaction.create({
      data: {
        fromWalletId: brandWallet.id,
        toWalletId: platformWallet.id,
        amount: pkg.price,
        type: TransactionType.BRAND_PAYMENT,
        status: TransactionStatus.COMPLETED,
        collabId: collab.id,
        provider: "RAZORPAY",
        externalPaymentId: `pay_${i}`,
        externalOrderId: `order_${i}`,
      },
    });

    // Platform credits creator (escrow released)
    await prisma.transaction.create({
      data: {
        fromWalletId: platformWallet.id,
        toWalletId: creatorWallet.id,
        amount: pkg.price,
        type: TransactionType.CREATOR_EARNING,
        status: TransactionStatus.COMPLETED,
        collabId: collab.id,
      },
    });

    // Update balances
    await prisma.wallet.update({
      where: { id: creatorWallet.id },
      data: {
        currentBalance: { increment: pkg.price },
        totalEarned: { increment: pkg.price },
      },
    });

    await prisma.wallet.update({
      where: { id: brandWallet.id },
      data: {
        totalSpent: { increment: pkg.price },
      },
    });
  }

  console.log("✅ Seeding completed successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
