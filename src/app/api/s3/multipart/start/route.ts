import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { s3 } from "../../aws";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: randomUUID(),
    ContentType: body.type,
  };

  const {Key, UploadId} = await s3.createMultipartUpload(s3Params).promise();

  return Response.json({
    method: "PUT",
    key: Key,
    uploadId: UploadId,
    headers: {
      "content-type": body.type,
    },
  });
}
