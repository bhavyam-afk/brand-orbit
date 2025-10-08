import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../db/prisma';



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, type } = body;

    if (!email || !password || !name || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign enum value for UserRole
    let role: 'INFLUENCER' | 'BRAND';
    if (type === 'brand') role = 'BRAND';
    else if (type === 'influencer') role = 'INFLUENCER';
    else return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });

    // Create user (use passwordHash field)
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
      },
    });

    // Create related profile
    if (role === 'BRAND') {
      await prisma.brandProfile.create({
        data: {
          userId: newUser.id,
          brandName: name,
        },
      });
    } else if (role === 'INFLUENCER') {
      // Use email prefix as default username if not provided
      const username = email.split('@')[0];
      await prisma.influencerProfile.create({
        data: {
          userId: newUser.id,
          username,
        },
      });
    }

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
