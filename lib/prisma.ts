import { PrismaClient } from '@prisma/client';

declare global {
	// allow global `var` declarations for dev hot-reload to avoid creating
	// new PrismaClient instances on every file change
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
