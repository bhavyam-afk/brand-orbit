import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const resolvedParams: any = await params;
    let usernameRaw: unknown = resolvedParams?.username;
    if (usernameRaw instanceof Promise) {
      usernameRaw = await usernameRaw;
    }
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? '');
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    // Fetch influencer's payments
    const influencer = await prisma.creatorProfile.findUnique({
      where: { username },
      include: { transaction: true },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }
    // Calculate wallet balance (sum of payments with status 'SUCCESS')
    // Serialize transaction amounts (Prisma Decimal -> string) and compute balance
    const payments = (influencer.transaction || []).map((p: any) => ({
      ...p,
      amount: p.amount && typeof p.amount === 'object' && p.amount.toString ? p.amount.toString() : String(p.amount ?? '0'),
    }));

    const balance = payments
      .filter((p: any) => p.status === 'SUCCESS')
      .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

    return NextResponse.json({ balance, payments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
