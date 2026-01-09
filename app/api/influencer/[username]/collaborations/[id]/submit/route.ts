import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]>; id: string | string[] | Promise<string> | Promise<string[]>; }; }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams: any = await params;
    const usernameRaw = resolvedParams?.username;
    const idRaw = resolvedParams?.id;

    const username = Array.isArray(usernameRaw) ? String(usernameRaw[0]) : String(usernameRaw ?? "");
    const collabId = Array.isArray(idRaw) ? String(idRaw[0]) : String(idRaw ?? "");

    if (!username || !collabId) {
      return NextResponse.json(
        { error: "Missing username or collaboration ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { description, fileUrls } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid description" },
        { status: 400 }
      );
    }

    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid file URLs" },
        { status: 400 }
      );
    }

    // Verify creator owns this collaboration
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const collab = await prisma.collaboration.findUnique({
      where: { id: collabId },
      include: { creator: true, packageCollaborations: true },
    });

    if (!collab) {
      return NextResponse.json(
        { error: "Collaboration not found" },
        { status: 404 }
      );
    }

    if (collab.creator.username !== username) {
      return NextResponse.json(
        { error: "Unauthorized: not your collaboration" },
        { status: 403 }
      );
    }

    if (collab.creatorId !== creator.id) {
      return NextResponse.json(
        { error: "Unauthorized: creator mismatch" },
        { status: 403 }
      );
    }

    // Update collaboration with draft submission
    const contentDraft = {
      fileUrls,
    };

    // Get the PackageCollaboration associated with this Collaboration
    const packageCollab = collab.packageCollaborations[0];
    if (!packageCollab) {
      return NextResponse.json(
        { error: "No package collaboration found" },
        { status: 400 }
      );
    }

    // Update the PackageCollaboration with draft content
    const updatedPackageCollab = await prisma.packageCollaboration.update({
      where: { id: packageCollab.id },
      data: {
        contentDraft: contentDraft as any,
        draftSubmittedAt: new Date(),
      },
    });

    const updated = await prisma.collaboration.findUnique({
      where: { id: collabId },
      include: {
        package: true,
        campaign: true,
        brand: true,
        packageCollaborations: true,
      },
    });

    return NextResponse.json(
      {
        message: "Draft submitted successfully",
        collaboration: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Submit work error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
