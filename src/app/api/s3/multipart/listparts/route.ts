import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { s3 } from "../../aws";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  let s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: body.key,
    UploadId: body.uploadId,
    PartNumberMarker: 0,
  }
  
  const {Parts} = await s3.listParts(s3Params).promise()


  return Response.json({
   parts: Parts,
  });
}
