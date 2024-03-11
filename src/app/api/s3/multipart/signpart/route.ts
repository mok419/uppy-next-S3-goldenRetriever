import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { s3 } from "../../aws";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  console.log("body", body);

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: body.key,
    UploadId: body.uploadId,
    PartNumber: body.partNumber,
  }

  const url = await s3.getSignedUrlPromise("uploadPart", s3Params);

  return Response.json({
    url,
  });
}
