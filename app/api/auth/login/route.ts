import { NextResponse } from 'next/server';
import prisma from '../../../../db/prisma';
import bcrypt from 'bcryptjs';
import { generateJWT } from '../../../../db/auth';

export async function POST(req: Request) {
  const { email, password, type } = await req.json();
  const secret = process.env.JWT_SECRET || 'default_secret';

  if (type === 'brand') {
    const user = await prisma.brand.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    const token = generateJWT({ id: user.id, email: user.email, type: 'brand' }, secret);
    return NextResponse.json({ username: user.name, token });
  }
  if (type === 'influencer') {
    const user = await prisma.influencer.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Influencer not found' }, { status: 404 });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    const token = generateJWT({ id: user.id, email: user.email, type: 'influencer' }, secret);
    return NextResponse.json({ username: user.name, token });
  }
  return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
}
