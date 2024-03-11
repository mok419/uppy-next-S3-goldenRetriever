import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { s3 } from "../../aws";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: body.key,
    UploadId: body.uploadId,
    MultipartUpload: {
      Parts: body.parts,
    },
  };

  const {Location} = await s3.completeMultipartUpload(s3Params).promise();

  return Response.json({
   location: Location,
  });
}
