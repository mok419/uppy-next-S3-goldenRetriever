import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { s3 } from "../../aws";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  console.log("body", body);

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: randomUUID(),
    Expires: 60,
    ContentType: body.type,
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);

  return Response.json({
    method: "PUT",
    url: uploadUrl,
    //key: Key,
    headers: {
      "content-type": body.type,
    },
  });
}
