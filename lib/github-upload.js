// Commits a file into this repo's public/ folder via the GitHub Contents API.
// This creates a real commit, so jsDelivr's GitHub CDN (cdn.jsdelivr.net/gh/...)
// can serve it immediately (using the commit SHA bypasses jsDelivr's branch cache).
//
// Best for small static assets (images/icons). GitHub's Contents API works
// reliably up to ~1-1.5MB per file; for anything bigger, use lib/r2.js instead.

const GITHUB_API = 'https://api.github.com'

function getConfig() {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  if (!token || !owner || !repo) {
    throw new Error('GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO must be set in env')
  }
  return { token, owner, repo, branch }
}

/**
 * @param {string} relativePath - path under public/, e.g. "images/tools/chatgpt.png"
 * @param {Buffer} buffer - file content
 * @param {string} [message] - commit message
 */
export async function commitFileToGitHub(relativePath, buffer, message) {
  const { token, owner, repo, branch } = getConfig()
  const fullPath = `public/${relativePath}`.replace(/\/+/g, '/')
  const base64Content = buffer.toString('base64')
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${fullPath}`

  // If the file already exists, GitHub requires its current sha to update it.
  let sha
  const existing = await fetch(`${url}?ref=${branch}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })
  if (existing.ok) {
    const data = await existing.json()
    sha = data.sha
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message || `chore: upload ${fullPath}`,
      content: base64Content,
      branch,
      ...(sha ? { sha } : {}),
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub commit failed (${res.status}): ${text}`)
  }

  const result = await res.json()
  const commitSha = result.commit?.sha

  return {
    path: fullPath,
    branch,
    commitSha,
    // Pinned to the exact commit -> always fresh, bypasses jsDelivr cache.
    jsdelivrUrl: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitSha}/${fullPath}`,
    // Tracks the branch -> convenient but jsDelivr caches branch refs up to ~7 days
    // (purge manually at https://www.jsdelivr.com/tools/purge if needed).
    jsdelivrLatestUrl: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${fullPath}`,
    githubRawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${fullPath}`,
  }
}
