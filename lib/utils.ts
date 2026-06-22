import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getAssetsBaseUrl(): string {
  // If API is like http://localhost:3001/api, assets are typically served from http://localhost:3001
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
  try {
    const u = new URL(api)
    return u.origin
  } catch {
    return "http://localhost:3001"
  }
}

export function normalizeImageUrl(url?: string): string | undefined {
  if (!url) return undefined
  // already absolute (http/https/data/blob)
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) return url
  const base = getAssetsBaseUrl()
  if (url.startsWith("/")) return `${base}${url}`
  return `${base}/${url}`
}

/**
 * Get the best image source: URL (normalized) → base64 fallback → placeholder.
 * Always falls back to base64 when no URL is present so product images render
 * even when the backend has only uploaded a base64 version.
 */
export function getImageSource(
  image?: { url?: string; base64?: string },
): string {
  if (image?.url) return normalizeImageUrl(image.url) || "/placeholder.svg"
  if (image?.base64) return image.base64
  return "/placeholder.svg"
}

/** Skip Next.js image optimizer — remote/MinIO URLs load directly in the browser. */
export function shouldUnoptimizeImage(url?: string): boolean {
  if (!url) return false
  if (url.startsWith("data:") || url.startsWith("blob:")) return true
  const normalized = normalizeImageUrl(url) || url
  return /^(https?:)?\/\//i.test(normalized)
}
