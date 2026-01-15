import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { uploadToS3 } from "@/lib/Uploadtos3"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const creatorId = formData.get("creatorId") as string

    if (!file || !creatorId) {
      return NextResponse.json(
        { error: "Missing file or creatorId" },
        { status: 400 }
      )
    }

    // convert to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split(".").pop()
    const key = `creators/${creatorId}/profile.${ext}`

    const imageUrl = await uploadToS3(
      buffer,
      key,
      file.type || "image/jpeg"
    )

    // save to DB
    await prisma.creatorProfile.update({
      where: { id: creatorId },
      data: { profilePicUrl: imageUrl },
    })

    return NextResponse.json({
      success: true,
      imageUrl,
    })
  } catch (err) {
    console.error("Creator DP upload error:", err)
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
