import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  // TEMP: Always return session or dummy object for dev
  return NextResponse.json(session || { message: "No session (dev mode)" });
}
