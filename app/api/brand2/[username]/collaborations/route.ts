
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    const { username } = await params;
    if (!username) {
        return NextResponse.json({ error: 'Missing username parameter' }, { status: 400 });
    }

    try {
        const collaborations = await prisma.collaboration.findMany({
            where: { brand: { username } },
            include: {
                packageCollaborations: true,
                campaignCollaborations: true,
                creator: true,
                brand: true,
                package: true,
                campaign: true,
            },
        });

        const brandData = await prisma.brandProfile.findUnique({
            where: { username },
            select: { id: true },
        });

        if (!brandData) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }

        const requests = await prisma.customPackageRequest.findMany({
            where: { brandId: brandData.id },
            include: {
                brand: true,
                creator: true,
            },
        });
        return NextResponse.json({ collaborations, requests }, { status: 200 });
    } catch (err) {
        console.error('Error fetching collaborations:', err);
        return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 });
    }
}