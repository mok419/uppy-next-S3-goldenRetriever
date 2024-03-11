import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { s3 } from "../../aws";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  console.log("body", body);

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: body.key,
    UploadId: body.uploadId,
  };

  await s3.abortMultipartUpload(s3Params).promise(); 

  return Response.json({
    success: true,
  });
}
