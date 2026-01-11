import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]>; id: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const resolvedParams: any = await params;
    let usernameRaw: unknown = resolvedParams?.username;
    let idRaw: unknown = resolvedParams?.id;
    if (usernameRaw instanceof Promise) usernameRaw = await usernameRaw;
    if (idRaw instanceof Promise) idRaw = await idRaw;
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? "");
    const id = Array.isArray(idRaw) ? idRaw[0] : String(idRaw ?? "");

    if (!username) return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    if (!id) return NextResponse.json({ error: "Invalid package id" }, { status: 400 });

    const body = await req.json();
    const newStatus = body?.status ? String(body.status).toUpperCase() : null;
    if (!newStatus) return NextResponse.json({ error: "status is required" }, { status: 400 });

    const creator = await prisma.creatorProfile.findUnique({ where: { username }, select: { id: true } });
    if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });

    const pkg = await prisma.package.findUnique({ where: { id }, select: {id: true, creatorId: true, packagestatus: true } });
    if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    if (pkg.creatorId !== creator.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    // Enforce maximum 2 active packages per creator when activating a draft
    if (newStatus === "ACTIVE" && pkg.packagestatus !== "ACTIVE") {
      const activeCount = await prisma.package.count({ where: { creatorId: creator.id, packagestatus: "ACTIVE" } });
      if (activeCount >= 2) {
        return NextResponse.json({ error: "Maximum 2 active packages allowed" }, { status: 400 });
      }
    }

    const updated = await prisma.package.update({
      where: { id },
      data: { packagestatus: newStatus as any },
    });

    const out = {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      price: typeof updated.price === "object" && updated.price?.toString ? updated.price.toString() : String(updated.price ?? ""),
      deliveryTimeDays: updated.deliveryTimeDays,
      thumbnailUrl: updated.thumbnailUrl,
      mediaType: updated.mediaType,
      deliverables: updated.deliverables,
      status: updated.packagestatus,
    };

    return NextResponse.json({ package: out }, { status: 200 });
  } catch (error) {
    console.error("[API] update package error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
