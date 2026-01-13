import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet || wallet.currentBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Lock funds
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          currentBalance: { decrement: amount },
        },
      });

      // 2️⃣ Create payout transaction
      await tx.transaction.create({
        data: {
          type: TransactionType.PAYOUT,
          status: TransactionStatus.PENDING,
          amount,
          fromWalletId: null, // platform wallet optional
          toWalletId: wallet.id,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Withdraw failed:", err);
    return NextResponse.json({ error: "Withdraw failed" }, { status: 500 });
  }
}
