import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = {
    params: {
        username: string;
    };
};

export async function GET(req: Request, { params }: Params) {
    try {
        const { username } = await params;

        // find brand by username
        const brand = await prisma.brandProfile.findUnique({
            where: { username },
            select: { id: true },
        });

        if (!brand) {
            return new NextResponse(JSON.stringify({ error: "Brand not found" }), { status: 404 });
        }

        const url = new URL(req.url);
        const creatorId = url.searchParams.get("creatorId") || undefined;

        const packages = await prisma.package.findMany({
            where: {
                creatorId,
                packagestatus: "ACTIVE",

                collaborations: {
                    none: {
                        brandId: brand.id,
                        creatorId, 
                        collabstatus: {
                            in: ["PENDING", "ACTIVE"],
                        },
                    },
                },
            },
        });

        return NextResponse.json({ packages });
    } catch (error) {
        console.error("/api/brand2/[username]/feed/package error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
