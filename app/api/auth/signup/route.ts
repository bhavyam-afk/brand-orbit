
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

/**
 * SIGN UP
 * - Creates User
 * - Creates BrandProfile or CreatorProfile
 * - Creates Wallet
 * - Does NOT authenticate user
 */
export async function POST(req : Request) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      password,
      type, // "brand" | "influencer"
    } = body;

    // -------------------------------
    // VALIDATION
    // -------------------------------
    if (!email || !name || !password || !type) {
      
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userType =
      type === "brand" ? "BRAND" :
      type === "influencer" ? "CREATOR" :
      null;

    if (!userType) {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    // -------------------------------
    // UNIQUENESS CHECK
    // -------------------------------
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    // -------------------------------
    // PASSWORD HASH
    // -------------------------------
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('[signup] password hashed');

    // -------------------------------
    // USER CREATION
    // -------------------------------
    console.log('[signup] creating user record');
    const user = await prisma.user.create({
      data: {
        email,
        username: name,
        passwordHash,
        userType,
      },
    });

    console.log('[signup] user created', { id: user.id, email: user.email, username: user.username });

    // -------------------------------
    // PROFILE CREATION
    // -------------------------------
    if (userType === "BRAND") {
      console.log('[signup] creating brandProfile for user', { userId: user.id });
      await prisma.brandProfile.create({
        data: {
          userId: user.id,
          username: name,
        },
      });
    }

    if (userType === "CREATOR") {
      console.log('[signup] creating creatorProfile for user', { userId: user.id });
      await prisma.creatorProfile.create({
        data: {
          userId: user.id,
          username: name,
          category: "NANO", // default
          nicheTags: [],
        },
      });
    }

    // -------------------------------
    // WALLET
    // -------------------------------
    await prisma.wallet.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Signup successful" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
