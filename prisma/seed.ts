import { PrismaClient, CreatorCategory, UserType, PackageStatus, CollabStatus, TransactionType, TransactionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// --- We use hardcoded IDs for easy linking ---
const USER_CREATOR_ID = 'cl_user_creator_123';
const USER_BRAND_ID = 'cl_user_brand_123';

const CREATOR_PROFILE_ID = 'cl_creator_profile_123';
const BRAND_PROFILE_ID = 'cl_brand_profile_123';

const PACKAGE_1_ID = 'cl_package_1_123';
const PACKAGE_2_ID = 'cl_package_2_123';

const CAMPAIGN_ID = 'cl_campaign_123';
const COLLAB_ID = 'cl_collab_123';

async function main() {
  console.log('Start seeding ...');

  // --- 1. Clean up the database ---
  // (Delete in reverse order of creation to avoid foreign key constraints)
  await prisma.transaction.deleteMany({});
  await prisma.collaboration.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.brandProfile.deleteMany({});
  await prisma.creatorProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // --- 2. Create Users ---
  const creatorUser = await prisma.user.create({
    data: {
      id: USER_CREATOR_ID,
      email: 'creator@example.com',
      passwordHash: 'hashed_password_123',
      userType: UserType.CREATOR,
    },
  });

  const brandUser = await prisma.user.create({
    data: {
      id: USER_BRAND_ID,
      email: 'brand@example.com',
      passwordHash: 'hashed_password_456',
      userType: UserType.BRAND,
    },
  });

  // --- 3. Create Wallets (with a starting state) ---
  const creatorWallet = await prisma.wallet.create({
    data: {
      userId: creatorUser.id,
      currentBalance: new Decimal(13500.0), // Represents 1 completed collab (15000 - 10% fee)
      pendingBalance: new Decimal(0.0),
      totalEarned: new Decimal(13500.0),
    },
  });

  const brandWallet = await prisma.wallet.create({
    data: {
      userId: brandUser.id,
      currentBalance: new Decimal(85000.0), // Represents 100k deposit - 15k payment
      totalSpent: new Decimal(15000.0),
    },
  });

  // --- 4. Create Profiles ---
  await prisma.creatorProfile.create({
    data: {
      id: CREATOR_PROFILE_ID,
      userId: creatorUser.id,
      bio: 'Fitness & Fashion enthusiast. Helping you look and feel your best!',
      profilePicUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      introClipUrl: 'https://example.com/intro.mp4',
      nicheTags: ['fitness', 'fashion', 'lifestyle', 'health'],
      portfolio: [
        { title: 'Previous Work with GymShark', url: 'https://example.com/gymshark' },
        { title: 'My UGC Portfolio', url: 'https://example.com/portfolio' },
      ],
      mlScore: 8.7,
      category: CreatorCategory.MICRO,
    },
  });

  await prisma.brandProfile.create({
    data: {
      id: BRAND_PROFILE_ID,
      userId: brandUser.id,
      brandName: 'FitLife Apparel',
      logoUrl: 'https://example.com/fitlife_logo.png',
      bio: 'Premium apparel for the modern athlete.',
      industryTags: ['apparel', 'fitness', 'ecommerce'],
      socialLinks: [
        { platform: 'website', url: 'https://fitlife.com' },
        { platform: 'instagram', url: 'https://instagram.com/fitlife' },
      ],
    },
  });

  // --- 5. Create Packages for the Creator ---
  await prisma.package.createMany({
    data: [
      {
        id: PACKAGE_1_ID,
        creatorId: CREATOR_PROFILE_ID,
        title: 'Instagram Post + Story',
        description: '1 high-quality Instagram feed post and 3 story frames with link sticker.',
        thumbnailUrl: 'https://example.com/ig_package.png',
        mediaType: 'Instagram Post',
        deliverables: ['1 Feed Post', '3 Story Frames', '1 Link in Bio'],
        deliveryTimeDays: 7,
        price: new Decimal(15000.0),
        status: PackageStatus.ACTIVE,
      },
      {
        id: PACKAGE_2_ID,
        creatorId: CREATOR_PROFILE_ID,
        title: 'Dedicated TikTok Video',
        description: '1 fully edited 30-60 second TikTok video using your product.',
        thumbnailUrl: 'https://example.com/tt_package.png',
        mediaType: 'TikTok Video',
        deliverables: ['1 TikTok Video', 'Sound trend research'],
        deliveryTimeDays: 5,
        price: new Decimal(25000.0),
        status: PackageStatus.ACTIVE,
      },
    ],
  });

  // --- 6. Create a Campaign for the Brand ---
  await prisma.campaign.createMany({
    data: [{
      id: CAMPAIGN_ID,
      brandId: BRAND_PROFILE_ID,
      name: 'Summer Launch 2026',
      budget: new Decimal(200000.0),
    },
    {
      id: '3',
      brandId: BRAND_PROFILE_ID,
      name: 'Summer Launch 2333',
      budget: new Decimal(200000.0),
    }]
  });

  // --- 7. Create a Collaboration ---
  await prisma.collaboration.create({
    data: {
      id: COLLAB_ID,
      creatorId: CREATOR_PROFILE_ID,
      brandId: BRAND_PROFILE_ID,
      packageId: PACKAGE_1_ID,
      campaignId: CAMPAIGN_ID,
      finalCost: new Decimal(15000.0),
      status: CollabStatus.COMPLETED,
      reportedReach: 55200,
      reportedEngagement: 3100,
      reportedRoiMetric: new Decimal(2.5),
      linksToPosts: [
        { platform: 'instagram', url: 'https://instagram.com/p/123456789' },
      ],
    },
  });

  // --- 8. Create Transactions for the Collab Workflow ---
  await prisma.transaction.createMany({
    data: [
      // 1. Brand deposits money into their wallet
      {
        walletId: brandWallet.id,
        userId: brandUser.id,
        amount: new Decimal(100000.0),
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
      },
      // 2. Brand pays for the collab (money moves to escrow, or is just "spent")
      {
        walletId: brandWallet.id,
        userId: brandUser.id,
        collabId: COLLAB_ID,
        amount: new Decimal(15000.0),
        type: TransactionType.PAYMENT,
        status: TransactionStatus.COMPLETED,
      },
      // 3. Creator gets paid out (15000 - 10% fee = 13500)
      {
        walletId: creatorWallet.id,
        userId: creatorUser.id,
        collabId: COLLAB_ID,
        amount: new Decimal(13500.0),
        type: TransactionType.PAYOUT,
        status: TransactionStatus.COMPLETED,
      },
      // 4. Platform takes its 10% fee
      {
        walletId: creatorWallet.id, // Or a platform wallet, but this links it
        userId: creatorUser.id,
        collabId: COLLAB_ID,
        amount: new Decimal(1500.0),
        type: TransactionType.FEE,
        status: TransactionStatus.COMPLETED,
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });