import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";

// Configure your S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface UploadRequestBody {
  fileContent: string;
  fileName: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fileContent, fileName }: UploadRequestBody = req.body;

  // Generate unique file key
  const uniqueFileName = `${Date.now()}-${fileName}`;

  try {
    // Upload the file to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: uniqueFileName,
      Body: Buffer.from(fileContent, "base64"), // Assuming fileContent is base64 encoded
      ContentType: "application/pdf", // Change this based on the file type
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // Store metadata in MongoDB
    const mongoRes = await fetch("https://data.mongodb-api.com/...", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify({
        time: new Date().toISOString(),
        fileName: uniqueFileName,
        fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`,
      }),
    });

    const data = await mongoRes.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    res.status(500).json({ error: "File upload failed" });
  }
}
