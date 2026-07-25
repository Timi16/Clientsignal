import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

/**
 * Generate a presigned PUT URL for direct browser upload to Cloudflare R2.
 * Returns the presigned URL and the full public URL for reading after upload.
 */
export async function createPresignedUploadUrl(opts: {
  fileKey: string;
  mimeType?: string;
  expiresIn?: number;
}): Promise<{ uploadUrl: string; publicUrl: string }> {
  const bucket = process.env.R2_BUCKET || 'clientssignal';
  const expiresIn = opts.expiresIn || 3600; // 1 hour default

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: opts.fileKey,
    ContentType: opts.mimeType || 'application/octet-stream',
  });

  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn });

  const publicBase = process.env.R2_PUBLIC_URL || '';
  const publicUrl = publicBase ? `${publicBase}/${opts.fileKey}` : '';

  return { uploadUrl, publicUrl };
}

/**
 * Generate a presigned GET URL for downloading a file from Cloudflare R2.
 */
export async function createPresignedDownloadUrl(opts: {
  fileKey: string;
  expiresIn?: number;
}): Promise<string> {
  const bucket = process.env.R2_BUCKET || 'clientssignal';
  const expiresIn = opts.expiresIn || 3600;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: opts.fileKey,
  });

  return getSignedUrl(getClient(), command, { expiresIn });
}
