import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';
import { generateJWT } from '../../../../lib/auth';



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, type } = body;
    const secret = process.env.JWT_SECRET || 'default_secret';

    if (!email || !password || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Find user in User table
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check role matches what was selected
    if ((type === 'brand' && user.userType !== 'BRAND') || (type === 'influencer' && user.userType !== 'CREATOR')) {
      return NextResponse.json({ error: 'User type mismatch' }, { status: 400 });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Only fetch profile after user is validated
    let profile = null;
    if (user.userType === 'BRAND') {
      profile = await prisma.brandProfile.findUnique({ where: { userId: user.id } });
    } else if (user.userType === 'CREATOR') {
      profile = await prisma.creatorProfile.findUnique({ where: { userId: user.id } });
    }

    const token = generateJWT({ id: user.id, email: user.email, role: user.userType }, secret);
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.userType,
      },
      profile,
    }, { status: 200 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}