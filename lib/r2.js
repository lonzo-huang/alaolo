// Cloudflare R2 (S3-compatible) client, used for PDFs and other large files
// that shouldn't go into the Git repo / jsDelivr.

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY must be set in env')
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

/**
 * @param {string} key - object key/path within the bucket, e.g. "files/whitepaper.pdf"
 * @param {Buffer} buffer
 * @param {string} contentType
 * @returns {Promise<string>} public URL
 */
export async function uploadToR2(key, buffer, contentType) {
  const bucket = process.env.R2_BUCKET
  const publicBase = process.env.R2_PUBLIC_URL // e.g. https://pub-xxxx.r2.dev or your custom domain
  if (!bucket) throw new Error('R2_BUCKET must be set in env')
  if (!publicBase) throw new Error('R2_PUBLIC_URL must be set in env (public bucket URL or custom domain)')

  const client = getR2Client()
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream',
  }))

  return `${publicBase.replace(/\/$/, '')}/${key}`
}

export async function deleteFromR2(key) {
  const bucket = process.env.R2_BUCKET
  if (!bucket) throw new Error('R2_BUCKET must be set in env')
  const client = getR2Client()
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}
