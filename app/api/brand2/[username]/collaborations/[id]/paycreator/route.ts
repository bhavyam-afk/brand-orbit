import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(
  req: Request,
  { params }: { params: { collabId: string } }
) {
  try {
    // 1️⃣ Auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collabId = params.collabId;

    // 2️⃣ Fetch collaboration
    const collab = await prisma.collaboration.findUnique({
      where: { id: collabId },
      include: {
        brand: true,
        packageCollaborations: {
          include: { package: true },
        },
      },
    });

    if (!collab) {
      return NextResponse.json({ error: "Collaboration not found" }, { status: 404 });
    }

    // 3️⃣ Ownership check
    if (collab.brand.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pkgCollab = collab.packageCollaborations[0];
    if (!pkgCollab) {
      return NextResponse.json({ error: "Package collaboration missing" }, { status: 400 });
    }

    // 4️⃣ Business rule
    if (
      pkgCollab.contentStatus !== "APPROVED" ||
      !pkgCollab.publishedAt
    ) {
      return NextResponse.json(
        { error: "Content not eligible for payment" },
        { status: 400 }
      );
    }

    // 5️⃣ Amount
    const amount = Number(pkgCollab.package.price) * 100;

    // 6️⃣ Create Razorpay Order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `collab_${collabId}`,
      notes: {
        collabId,
        packageCollabId: pkgCollab.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
