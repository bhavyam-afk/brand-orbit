import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const resolvedParams: any = await params;
    let usernameRaw: unknown = resolvedParams?.username;
    if (usernameRaw instanceof Promise) {
      usernameRaw = await usernameRaw;
    }
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? '');

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    // Get creator profile settings
    const creator = await prisma.creatorProfile.findUnique({
      where: { username },
      include: {
        user: true
      }
    });

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    // Normalize nicheTags and platformLinks
    let nicheTags = creator.nicheTags;
    if (!Array.isArray(nicheTags)) nicheTags = nicheTags ? [String(nicheTags)] : [];

    let platformLinks = creator.platformLinks;
    if (typeof platformLinks === 'string') {
      try {
        platformLinks = JSON.parse(platformLinks);
      } catch (e) {
        platformLinks = {};
      }
    }

    const settings = {
      username: creator.username,
      email: creator.user.email,
      location: creator.location,
      niche: creator.niche,
      nicheTags,
      platformLinks: platformLinks || {},
      category: creator.category
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}