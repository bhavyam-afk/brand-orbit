import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "./s3"

export async function uploadToS3(
  fileBuffer: Buffer,
  key: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read",
  })

  await s3.send(command)

  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
