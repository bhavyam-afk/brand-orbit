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
    const { email, name, password, type, } = body;

    // VALIDATION
    if (!email || !name || !password || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userType = (type === "brand") ? "BRAND" : "CREATOR" ;

    // UNIQUENESS CHECK
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    // PASSWORD HASHING
    const passwordHash = await bcrypt.hash(password, 10);

    // USER CREATION
    const user = await prisma.user.create({
      data: {
        email,
        username: name,
        passwordHash,
        userType,
      },
    });

    // making of brand.
    if (userType === "BRAND") {
      await prisma.brandProfile.create({
        data: {
          userId: user.id,
          username: name,
        },
      }),
      await prisma.wallet.create({
      data: {
        userId: user.id,
        walletType: "BRAND",
      },
    });
    }

    // making of creator.
    if (userType === "CREATOR") {
      await prisma.creatorProfile.create({
        data: {
          userId: user.id,
          username: name,
          category: "NANO",
        },
      }), 
      await prisma.wallet.create({
        data: {
          userId: user.id,
          walletType: "CREATOR",
        },
      })
    }
    

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
