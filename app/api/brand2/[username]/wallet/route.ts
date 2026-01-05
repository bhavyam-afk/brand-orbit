import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] } }
) {
  try {
    const resolved: any = await params;
    let username: any = resolved?.username;
    if (Array.isArray(username)) username = username[0];
    if (!username) return NextResponse.json({ error: "Invalid username" }, { status: 400 });

    const brand = await prisma.brandProfile.findFirst({ where: { username } });
    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: brand.userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          include: {
            collaboration: {
              include: {
                creator: { select: { id: true, username: true } },
                package: { select: { id: true, title: true } },
              }
            }
          }
        }
      }
    });

    // Prepare default empty response when wallet missing
    if (!wallet) {
      const empty = {
        monthlySpending: [],
        totalSpent: 0,
        pendingAmount: 0,
        balance: 0,
        transactions: []
      };
      return NextResponse.json(empty, { status: 200 });
    }

    // Build last 6 months keys
    const months: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push(key);
    }

    const monthlyMap: Record<string, number> = {};
    months.forEach(m => (monthlyMap[m] = 0));

    const mappedTransactions = (wallet.transactions || []).map((t: any) => ({
      id: t.id,
      amount: Number(t.amount),
      type: t.type,
      status: t.status,
      createdAt: t.createdAt,
      collaboration: t.collaboration ? {
        id: t.collaboration.id,
        creatorUsername: t.collaboration.creator?.username,
        packageTitle: t.collaboration.package?.title,
      } : null,
    }));

    // Sum payments (type PAYMENT) completed into monthlyMap
    for (const t of mappedTransactions) {
      if (!t.createdAt) continue;
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (key in monthlyMap && t.type === 'PAYMENT' && (t.status === 'COMPLETED' || t.status === 'PAYOUT')) {
        monthlyMap[key] += Number(t.amount || 0);
      }
    }

    const monthlySpending = months.map(m => ({ month: m, amount: monthlyMap[m] || 0 }));

    const result = {
      monthlySpending,
      totalSpent: Number(wallet.totalSpent || 0),
      pendingAmount: Number(wallet.pendingBalance || 0),
      balance: Number(wallet.currentBalance || 0),
      transactions: mappedTransactions,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[BRAND WALLET ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
