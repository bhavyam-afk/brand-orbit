import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// If using TypeScript, install types: npm install --save-dev @types/jsonwebtoken

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function generateJWT(payload: Record<string, any>, secret: string, expiresIn: string = '1d'): string {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

