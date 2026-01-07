import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    // `params` is a plain object provided by Next.js — no need to await.
    const resolvedParams: any = params;
    const usernameRaw = resolvedParams?.username;
    const username = Array.isArray(usernameRaw) ? String(usernameRaw[0]) : String(usernameRaw ?? '');
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    // Fetch influencer profile
    const influencer = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const creatorId = influencer.id;

    // Helper: convert Prisma Decimal -> number safely
    const toNumber = (val: any) => {
      try {
        if (val == null) return 0;
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return Number(val) || 0;
        if (val.toString) return Number(val.toString()) || 0;
      } catch (e) {
        return 0;
      }
      return 0;
    };

    // Recent transactions (include collaboration -> brand info)
    const transactions: any[] = await prisma.transaction.findMany({
      where: { creatorId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        collaboration: {
          select: {
            id: true,
            brand: { select: { id: true, username: true, logoUrl: true } },
          },
        },
      },
    });

    const serializedTransactions = transactions.map((t: any) => ({
      id: t.id,
      amount: t.amount && t.amount.toString ? t.amount.toString() : String(t.amount ?? '0'),
      type: t.type,
      status: t.status,
      createdAt: t.createdAt,
      collabId: t.collabId,
      collaboration: t.collaboration ? {
        id: t.collaboration.id,
        brand: t.collaboration.brand ? {
          id: t.collaboration.brand.id,
          username: t.collaboration.brand.username,
          logoUrl: t.collaboration.brand.logoUrl,
        } : null,
      } : null,
    }));

    // Totals: withdrawn (completed withdrawals), pending payments (pending earnings)
    const totalWithdrawn = transactions
      .filter((t: any) => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + toNumber(t.amount), 0);

    const earningTypes = ['PAYMENT', 'PAYOUT', 'DEPOSIT'];
    const pendingAmount = transactions
      .filter((t: any) => t.status === 'PENDING' && earningTypes.includes(t.type))
      .reduce((sum: number, t: any) => sum + toNumber(t.amount), 0);

    // 6 latest months earnings (including current month)
    const months: { label: string; start: Date; end: Date }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1, 0, 0, 0, 0);
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0, 0);
      const label = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
      months.push({ label, start, end });
    }

    // Fetch completed earnings since oldest month start to minimize data
    const earliest = months[0].start;
    const completedEarnings: any[] = await prisma.transaction.findMany({
      where: {
        creatorId,
        status: 'COMPLETED',
        // @ts-ignore
        type: { in: earningTypes },
        createdAt: { gte: earliest },
      },
      select: { amount: true, createdAt: true },
    });

    const earningsByMonth: Record<string, number> = {};
    months.forEach((m) => (earningsByMonth[m.label] = 0));

    completedEarnings.forEach((t: any) => {
      const d = new Date(t.createdAt);
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (earningsByMonth[label] === undefined) return;
      earningsByMonth[label] += toNumber(t.amount);
    });

    const earnings = months.map((m) => ({ month: m.label, amount: earningsByMonth[m.label] || 0 }));

    // Compute balance: sum of completed earnings minus completed withdrawals
    const completedTotal = transactions
      .filter((t: any) => t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => {
        // earnings add, withdrawals subtract
        if (t.type === 'WITHDRAWAL') return sum - toNumber(t.amount);
        return sum + toNumber(t.amount);
      }, 0);

    return NextResponse.json({
      earnings, // last 6 months
      totalWithdrawn,
      pendingAmount,
      balance: completedTotal,
      transactions: serializedTransactions,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
