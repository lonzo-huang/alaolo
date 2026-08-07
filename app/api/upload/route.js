import { NextResponse } from 'next/server'
import { commitFileToGitHub } from '@/lib/github-upload'
import { uploadToR2 } from '@/lib/r2'

function checkAuth(request) {
  const key = request.headers.get('x-api-key')
  return !!process.env.CONTENT_API_KEY && key === process.env.CONTENT_API_KEY
}

// GitHub Contents API is only reliable for small files. Anything bigger
// should go to R2 instead (use type=file).
const IMAGE_MAX_BYTES = 1.5 * 1024 * 1024 // ~1.5MB

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-')
}

// POST /api/upload  (multipart/form-data)
// Fields:
//   file    - the file to upload (required)
//   type    - "image" (default) -> committed to the dedicated media repo, served via jsDelivr
//             "file"             -> uploaded to Cloudflare R2 (for PDFs / large files)
//   folder  - optional subfolder within the media repo, default "images" or "files"
//
// Requires header: x-api-key: <CONTENT_API_KEY>
export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'unauthorized: missing or invalid x-api-key header' }, { status: 401 })
  }
  try {
    const form = await request.formData()
    const file = form.get('file')
    const type = (form.get('type') || 'image').toString()
    const folderRaw = form.get('folder')
    const folder = (folderRaw ? folderRaw.toString() : (type === 'image' ? 'images' : 'files')).replace(/^\/+|\/+$/g, '')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'file is required (multipart/form-data)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `${folder}/${Date.now()}-${sanitizeFilename(file.name || 'upload')}`

    if (type === 'image') {
      if (buffer.length > IMAGE_MAX_BYTES) {
        return NextResponse.json({
          error: `image too large for GitHub/jsDelivr (${(buffer.length / 1024 / 1024).toFixed(2)}MB > 1.5MB limit). Use type=file to upload to R2 instead.`,
        }, { status: 400 })
      }
      const result = await commitFileToGitHub(key, buffer, `chore: upload image ${key}`)
      return NextResponse.json({ ok: true, url: result.jsdelivrUrl, ...result }, { status: 201 })
    }

    // type=file -> Cloudflare R2 (PDFs, large files)
    const url = await uploadToR2(key, buffer, file.type || 'application/octet-stream')
    return NextResponse.json({ ok: true, url, key }, { status: 201 })
  } catch (e) {
    console.error('POST /api/upload error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
