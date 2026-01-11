import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user:", { 
      id: (session.user as any).id,
      email: (session.user as any).email,
      username: (session.user as any).username
    });

    const formData = await req.formData();
    const collabId = formData.get('collabId') as string;
    const file = formData.get('file') as File;

    if (!collabId || !file) {
      return NextResponse.json({ error: "Missing collabId or file" }, { status: 400 });
    }

    // 1️⃣ fetch creator profile
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });

    if (!creator) {
      console.error("Creator not found for userId:", (session.user as any).id);
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // 2️⃣ verify collaboration
    const collab = await prisma.collaboration.findUnique({
      where: { id: collabId },
      include: { packageCollaborations: true, creator: { select: { username: true } } },
    });

    if (!collab) {
      console.error("Collaboration not found:", collabId);
      return NextResponse.json({ error: "Collaboration not found" }, { status: 404 });
    }

    const packageCollab = collab.packageCollaborations?.[0];
    if (!packageCollab) {
      console.error("No package collaboration found");
      return NextResponse.json({ error: "Invalid collaboration" }, { status: 403 });
    }

    if (collab.collabstatus !== "ACTIVE") {
      console.error("Collaboration not active. Status:", collab.collabstatus);
      return NextResponse.json({ error: "Collaboration is not active" }, { status: 403 });
    }

    // 3️⃣ Upload file to S3 (backend handles it)
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileKey = `drafts/creators/${creator.id}/collabs/${collab.id}/${timestamp}.${fileExt}`;

    const fileBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileKey,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return NextResponse.json({ 
      fileUrl,
      fileName: file.name,
      fileType: file.type,
    });
  } catch (error) {
    console.error("Upload URL generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
