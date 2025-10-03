import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // You can add logic here if you want to protect routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/brand/profile', '/influencer/profile'],
};
