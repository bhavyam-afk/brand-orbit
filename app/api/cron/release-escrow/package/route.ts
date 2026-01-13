import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";

export async function POST() {
    try {
        const HOLD_DAYS = 3;

        const releaseBefore = new Date();
        releaseBefore.setDate(releaseBefore.getDate() - HOLD_DAYS);

        // 1️⃣ Find eligible escrow transactions
        const pendingEscrows = await prisma.transaction.findMany({
            where: {
                type: TransactionType.CREATOR_EARNING,
                status: TransactionStatus.PENDING,
                createdAt: {
                    lte: releaseBefore,
                },
            },
            include: {
                toWallet: true,
            },
        });

        if (pendingEscrows.length === 0) {
            return NextResponse.json({
                success: true,
                released: 0,
                message: "No escrow transactions to release",
            });
        }

        // 2️⃣ Process each escrow atomically
        for (const tx of pendingEscrows) {
            if (!tx.toWalletId) continue;

            await prisma.$transaction(async (db) => {
                // a) Mark transaction completed
                await db.transaction.update({
                    where: { id: tx.id },
                    data: {
                        status: TransactionStatus.INWALLET,
                    },
                });

                // b) Move money from pending → available
                await db.wallet.update({
                    where: { id: tx.toWalletId || "" },
                    data: {
                        pendingBalance: { decrement: tx.amount },
                        currentBalance: { increment: tx.amount },
                    },
                });

                // c) Optional: mark collaboration completed
                if (tx.collabId) {
                    await db.collaboration.update({
                        where: { id: tx.collabId },
                        data: {
                            collabstatus: "COMPLETED",
                        },
                    });
                }
            });
        }

        return NextResponse.json({
            success: true,
            released: pendingEscrows.length,
        });
    } catch (err) {
        console.error("Escrow release cron failed:", err);
        return NextResponse.json(
            { error: "Escrow release failed" },
            { status: 500 }
        );
    }
}
