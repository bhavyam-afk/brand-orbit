import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const razorpay_order_id = body?.razorpay_order_id || body?.order_id || null;
    const razorpay_payment_id = body?.razorpay_payment_id || body?.payment_id || null;
    const razorpay_signature = body?.razorpay_signature || body?.signature || null;
    const collabId = body?.collabId || body?.collab_id || body?.collaborationId || body?.collaboration_id || null;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing razorpay payload' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generated = crypto.createHmac('sha256', secret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');
    if (generated !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment' }, { status: 400 });
    }

    // idempotency: avoid double-processing the same external payment
    try {
      const existing = await prisma.transaction.findFirst({ where: { externalPaymentId: String(razorpay_payment_id) } as any });
      if (existing) {
        return NextResponse.json({ success: true });
      }
    } catch (e) {
      // If the DB doesn't have externalPaymentId column, continue (best-effort)
      console.warn('externalPaymentId check skipped or failed:', e);
    }

    if (!collabId) {
      return NextResponse.json({ error: 'Missing collabId in payload' }, { status: 400 });
    }

    const collab = await prisma.collaboration.findUnique({
      where: { id: String(collabId) },
      include: {
        creator: { include: { wallet: true } },
        packageCollaborations: { include: { package: true } },
      },
    });

    if (!collab) return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    if (!collab.creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    if (!collab.creator.wallet) return NextResponse.json({ error: 'Creator wallet not found' }, { status: 400 });

    const pkgColl = Array.isArray(collab.packageCollaborations) ? collab.packageCollaborations[0] : null;
    if (!pkgColl) return NextResponse.json({ error: 'Package collaboration not found' }, { status: 400 });

    if (String(pkgColl.contentStatus) !== 'APPROVED') return NextResponse.json({ error: 'Content not approved' }, { status: 400 });
    if (!pkgColl.publishedAt) return NextResponse.json({ error: 'Content not published' }, { status: 400 });

    const pkg = pkgColl.package;
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 400 });

    const amount = Number(pkg.price ?? 0);
    if (isNaN(amount) || amount <= 0) return NextResponse.json({ error: 'Invalid package amount' }, { status: 400 });

    const platformFee = Math.round((amount * 0.1) * 100) / 100; // 10%
    const creatorAmount = Math.round((amount - platformFee) * 100) / 100;

    // perform DB updates in a transaction
    await prisma.$transaction(async (tx) => {
      // 1) create PAYMENT transaction
      await tx.transaction.create({
        data: {
          type: 'PAYMENT',
          status: 'COMPLETED',
          amount: creatorAmount,
          creatorId: collab.creatorId,
          walletId: collab.creator.wallet?.id,
          collabId: collab.id,
          externalPaymentId: String(razorpay_payment_id) as any,
        } as any,
      });

      // 2) update wallet
      await tx.wallet.update({
        where: { id: collab.creator.wallet?.id },
        data: {
          currentBalance: { increment: creatorAmount } as any,
          totalEarned: { increment: creatorAmount } as any,
        } as any,
      });

      // 3) platform fee record (optional)
      await tx.transaction.create({
        data: {
          type: 'FEE',
          status: 'COMPLETED',
          amount: platformFee,
          collabId: collab.id,
        } as any,
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('razorpay verify error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
