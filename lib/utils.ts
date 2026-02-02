import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the best image source, prioritizing URL over base64 for performance
 * @param image - Image object with url and/or base64
 * @returns The best image source (URL preferred, fallback to base64, then placeholder)
 */
export function getImageSource(image?: { url?: string; base64?: string }): string {
  if (image?.url) return image.url
  if (image?.base64) return image.base64
  return "/placeholder.svg"
}
