import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const resolvedParams: any = await params;
    const usernameRaw = await resolvedParams?.username;
    const username = Array.isArray(usernameRaw) ? String(usernameRaw[0]) : String(usernameRaw ?? '');
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    // Fetch influencer profile
    const influencer = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    // `influencer` here is a CreatorProfile; wallet.userId references the User.id stored
    // on the CreatorProfile as `userId`. Use that to find the wallet.
    const userId = influencer.userId;

    const wallets = await prisma.wallet.findUnique({
      where: { userId },
      include: { outgoingTransactions: true, incomingTransactions: true },
    }); 
    return NextResponse.json({
      currentBalance: wallets?.currentBalance,
      pendingBalance: wallets?.pendingBalance,
      totalEarned: wallets?.totalEarned,
      totalSpent: wallets?.totalSpent,
      withdrawls: wallets?.outgoingTransactions || [],
      earnings: wallets?.incomingTransactions || [],
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
