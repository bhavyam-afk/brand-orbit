import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../db/prisma';
import { generateJWT } from '../../../../db/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, type } = body;
    const secret = process.env.JWT_SECRET || 'default_secret';

    if (!email || !password || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    let user = null;
    if (type === 'brand') {
      user = await prisma.brand.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
      }
    } else if (type === 'influencer') {
      user = await prisma.influencer.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Influencer not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateJWT({ id: user.id, email: user.email, type }, secret);
    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, type } }, { status: 200 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
