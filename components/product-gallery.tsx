"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductImage {
  url?: string
  base64?: string
}

interface ProductGalleryProps {
  images: {
    image1?: ProductImage
    image2?: ProductImage
    image3?: ProductImage
  }
  productName: string | { uz: string; ru: string; en: string }
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mainImageLoading, setMainImageLoading] = useState(true)
  const [thumbnailLoading, setThumbnailLoading] = useState<Record<number, boolean>>({})

  // Collect all available images - prioritize URL over base64 for performance
  const availableImages: string[] = []
  
  // Helper to get best image source (URL preferred over base64)
  const getBestImage = (img?: ProductImage) => {
    if (!img) return null
    return img.url || img.base64 || null
  }
  
  const img1 = getBestImage(images.image1)
  if (img1) availableImages.push(img1)
  
  const img2 = getBestImage(images.image2)
  if (img2) availableImages.push(img2)
  
  const img3 = getBestImage(images.image3)
  if (img3) availableImages.push(img3)

  // If no images, use placeholder
  if (availableImages.length === 0) {
    availableImages.push("/placeholder.svg")
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? availableImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === availableImages.length - 1 ? 0 : prev + 1))
  }

  // Reset main image loading when current index changes
  useEffect(() => {
    setMainImageLoading(true)
  }, [currentIndex])

  const productNameStr = typeof productName === 'string' ? productName : productName.ru || productName.uz || productName.en

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Left Column - Thumbnails */}
      <div className="flex flex-col gap-2">
        {availableImages.map((image, index) => {
          const isLoading = thumbnailLoading[index] !== false
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
                currentIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {isLoading && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              <Image
                src={image}
                alt={`${productNameStr} - Thumbnail ${index + 1}`}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 25vw, 10vw"
                onLoad={() => {
                  setThumbnailLoading((prev) => ({ ...prev, [index]: false }))
                }}
                onError={() => {
                  setThumbnailLoading((prev) => ({ ...prev, [index]: false }))
                }}
              />
            </button>
          )
        })}
      </div>

      {/* Right Column - Main Image */}
      <div className="col-span-3 relative aspect-square overflow-hidden rounded-lg bg-muted">
        {mainImageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
        )}
        <Image
          src={availableImages[currentIndex]}
          alt={`${productNameStr} - Image ${currentIndex + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            mainImageLoading ? "opacity-0" : "opacity-100"
          }`}
          priority={currentIndex === 0}
          onLoad={() => setMainImageLoading(false)}
          onError={() => setMainImageLoading(false)}
        />
        
        {/* Navigation Arrows - Only show if more than 1 image */}
        {availableImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white cursor-pointer"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white cursor-pointer"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {availableImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {availableImages.length}
          </div>
        )}
      </div>
    </div>
  )
}
