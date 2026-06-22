import { normalizeImageUrl } from "@/lib/utils"

export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null

  const trimmed = url.trim()
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export function convertToYouTubeEmbedUrl(url: string): string {
  if (!url) return ""

  const trimmed = url.trim()
  const videoId = extractYouTubeVideoId(trimmed)
  if (videoId) return `https://www.youtube.com/embed/${videoId}`
  if (trimmed.includes("youtube.com/embed/")) return trimmed
  return trimmed
}

export function getYouTubeThumbnailUrl(
  url: string,
  quality: "default" | "hq" | "mq" | "max" = "hq",
): string | null {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null

  const qualityMap = {
    default: "default",
    hq: "hqdefault",
    mq: "mqdefault",
    max: "maxresdefault",
  }

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

export function getBlogPreviewImage(post: {
  featuredImageUrl?: string | null
  featuredImageBase64?: string | null
  youtubeLink?: string | null
}): string {
  if (post.featuredImageUrl) {
    return normalizeImageUrl(post.featuredImageUrl) || "/placeholder.svg"
  }

  if (post.featuredImageBase64) {
    return post.featuredImageBase64
  }

  if (post.youtubeLink) {
    return getYouTubeThumbnailUrl(post.youtubeLink) || "/placeholder.svg"
  }

  return "/placeholder.svg"
}
