import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import {
    TransactionType,
    TransactionStatus,
    WalletType,
    CollabStatus,
    contentStatus,
} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            collabId,
        } = body;

        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature ||
            !collabId
        ) {
            return NextResponse.json(
                { error: "Missing payment payload" },
                { status: 400 }
            );
        }

        /* -----------------------------------------
         * 1️⃣ VERIFY RAZORPAY SIGNATURE
         * ----------------------------------------- */
        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Invalid Razorpay signature" },
                { status: 400 }
            );
        }

        /* -----------------------------------------
         * 2️⃣ IDEMPOTENCY CHECK
         * ----------------------------------------- */
        const alreadyProcessed = await prisma.transaction.findFirst({
            where: {
                externalPaymentId: razorpay_payment_id,
            },
        });

        if (alreadyProcessed) {
            return NextResponse.json({ success: true });
        }

        /* -----------------------------------------
         * 3️⃣ LOAD COLLAB + WALLETS
         * ----------------------------------------- */
        const collab = await prisma.collaboration.findUnique({
            where: { id: collabId },
            include: {
                creator: { include: { wallet: true } },
                packageCollaborations: true,
                package: true,
            },
        });

        if (!collab || !collab.package) {
            return NextResponse.json(
                { error: "Collaboration not found" },
                { status: 404 }
            );
        }

        const pkgCollab = collab.packageCollaborations[0];
        if (
            !pkgCollab ||
            pkgCollab.contentStatus !== contentStatus.APPROVED ||
            !pkgCollab.publishedAt
        ) {
            return NextResponse.json(
                { error: "Content not approved or published" },
                { status: 400 }
            );
        }

        if (!collab.creator.wallet) {
            return NextResponse.json(
                { error: "Creator wallet not found" },
                { status: 400 }
            );
        }

        const platformWallet = await prisma.wallet.findFirst({
            where: { walletType: WalletType.PLATFORM },
        });

        if (!platformWallet) {
            return NextResponse.json(
                { error: "Platform wallet missing" },
                { status: 500 }
            );
        }

        /* -----------------------------------------
         * 4️⃣ CALCULATE ESCROW SPLIT
         * ----------------------------------------- */
        const totalAmount = Number(collab.package.price);
        const platformFee = Math.round(totalAmount * 0.1 * 100) / 100;
        const creatorAmount = totalAmount - platformFee;

        /* -----------------------------------------
         * 5️⃣ ATOMIC ESCROW TRANSACTION
         * ----------------------------------------- */
        await prisma.$transaction(async (tx) => {
            // BRAND PAYMENT (external → platform)
            await tx.transaction.create({
                data: {
                    type: TransactionType.BRAND_PAYMENT,
                    status: TransactionStatus.COMPLETED,
                    amount: totalAmount,
                    toWalletId: platformWallet.id,
                    collabId,
                    externalPaymentId: razorpay_payment_id,
                    externalOrderId: razorpay_order_id,
                    provider: "RAZORPAY",
                },
            });

            // CREATOR EARNING (escrow - pending)
            await tx.transaction.create({
                data: {
                    type: TransactionType.CREATOR_EARNING,
                    status: TransactionStatus.PENDING,
                    amount: creatorAmount,
                    fromWalletId: platformWallet.id,
                    toWalletId: collab.creator.wallet?.id,
                    collabId,
                },
            });

            // PLATFORM FEE (revenue)
            await tx.transaction.create({
                data: {
                    type: TransactionType.PLATFORM_FEE,
                    status: TransactionStatus.COMPLETED,
                    amount: platformFee,
                    fromWalletId: platformWallet.id,
                    toWalletId: platformWallet.id,
                    collabId,
                },
            });

            // UPDATE WALLETS
            await tx.wallet.update({
                where: { id: collab.creator.wallet?.id },
                data: {
                    pendingBalance: { increment: creatorAmount },
                    totalEarned: { increment: creatorAmount },
                },
            });

            await tx.wallet.update({
                where: { id: platformWallet.id },
                data: {
                    totalEarned: { increment: platformFee },
                },
            });

            // UPDATE COLLAB STATE
            await tx.collaboration.update({
                where: { id: collabId },
                data: {
                    collabstatus: CollabStatus.COMPLETED,
                },
            });
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("payment verify error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
