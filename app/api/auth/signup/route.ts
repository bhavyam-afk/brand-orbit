import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';



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

    // Assign enum value for UserType
    let userType: 'CREATOR' | 'BRAND';
    if (type === 'brand') userType = 'BRAND';
    else if (type === 'influencer') userType = 'CREATOR';
    else return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });

    // Create user (use passwordHash field)
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        userType,
      },
    });

    // Create related profile
    if (userType === 'BRAND') {
      await prisma.brandProfile.create({
        data: {
          userId: newUser.id,
          brandName: name,
        },
      });
    } else if (userType === 'CREATOR') {
      // Use email prefix as base username
      let baseUsername = email.split('@')[0];
      let username = baseUsername;
      let suffix = 1;
      // Ensure username is unique
      while (await prisma.creatorProfile.findUnique({ where: { username } })) {
        username = `${baseUsername}${suffix}`;
        suffix++;
      }
      await prisma.creatorProfile.create({
        data: {
          userId: newUser.id,
          username,
          category: 'NANO', // Default category for new creators
        },
      });
    }

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
