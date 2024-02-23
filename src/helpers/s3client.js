import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  BUCKET_NAME as Bucket,
  EXPIRES_IN as expiresIn,
  S3_ACCESS_KEY as accessKeyId,
  S3_SECRET_ACESS_KEY as secretAccessKey,
} from "../utils/constants.js";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: { accessKeyId, secretAccessKey },
});

export async function getObjectURL(Key) {
  const command = new GetObjectCommand({ Bucket, Key });
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

export async function putObjectURL(filename, ContentType) {
  try {
    const command = new PutObjectCommand({
      Bucket,
      Key: `pdfs/${filename}`,
      ContentType,
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
  } catch (error) {
    console.log("ERROR::", error);
  }
}
