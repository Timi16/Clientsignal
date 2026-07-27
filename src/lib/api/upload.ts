/**
 * Upload a file directly to R2 using a presigned URL.
 * 1. Get presigned URL from the API
 * 2. PUT the file to R2
 * 3. Confirm the upload
 */
export async function uploadToPresignedUrl(presignedUrl: string, file: File): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
}
