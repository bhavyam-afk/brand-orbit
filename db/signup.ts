"use client";
import prisma from './client';

type SignupParams = {
    name: string;
    email: string;
    password: string;
    type: 'brand' | 'influencer';
};

export async function signupUser(params: SignupParams) {
    const { name, email, password, type } = params;
    if (type === 'brand') {
        const existingBrand = await prisma.brand.findUnique({ where: { email } });
        if (existingBrand) throw new Error('Brand already exists');
        return await prisma.brand.create({ data: { name, email, password } });
    }
    if (type === 'influencer') {
        const existingInfluencer = await prisma.influencer.findUnique({ where: { email } });
        if (existingInfluencer) throw new Error('Influencer already exists');
        return await prisma.influencer.create({ data: { name, email, password } });
    }
    throw new Error('Invalid user type');
}

export async function getUserByEmailAndPassword(email: string, password: string, type: 'brand' | 'influencer') {
    if (type === 'brand') {
        const user = await prisma.brand.findFirst({ where: { email, password } });
        if (!user) return null;
        return { username: user.name, ...user };
    }
    if (type === 'influencer') {
        const user = await prisma.influencer.findFirst({ where: { email, password } });
        if (!user) return null;
        return { username: user.name, ...user };
    }
    return null;
}
