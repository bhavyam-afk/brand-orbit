import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    // Fetch influencer's payments
    const influencer = await prisma.influencerProfile.findUnique({
      where: { username },
      include: { payments: true },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }
    // Calculate wallet balance (sum of payments with status 'SUCCESS')
    const balance = influencer.payments
      .filter((p: any) => p.status === 'SUCCESS')
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    return NextResponse.json({ balance, payments: influencer.payments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
