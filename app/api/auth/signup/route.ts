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

    if (type === 'brand') {
      const existingBrand = await prisma.brand.findUnique({ where: { email } });
      if (existingBrand) {
        return NextResponse.json({ error: 'Brand already exists' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newBrand = await prisma.brand.create({ data: { name, email, password: hashedPassword } });
      return NextResponse.json({ user: newBrand }, { status: 201 });
    }
    if (type === 'influencer') {
      const existingInfluencer = await prisma.influencer.findUnique({ where: { email } });
      if (existingInfluencer) {
        return NextResponse.json({ error: 'Influencer already exists' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newInfluencer = await prisma.influencer.create({ data: { name, email, password: hashedPassword } });
      return NextResponse.json({ user: newInfluencer }, { status: 201 });
    }
    return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
