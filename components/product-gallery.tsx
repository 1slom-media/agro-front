"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  // Collect all available images
  const availableImages: string[] = []
  
  if (images.image1?.base64 || images.image1?.url) {
    availableImages.push(images.image1.base64 || images.image1.url || "")
  }
  if (images.image2?.base64 || images.image2?.url) {
    availableImages.push(images.image2.base64 || images.image2.url || "")
  }
  if (images.image3?.base64 || images.image3?.url) {
    availableImages.push(images.image3.base64 || images.image3.url || "")
  }

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

  const productNameStr = typeof productName === 'string' ? productName : productName.ru || productName.uz || productName.en

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Left Column - Thumbnails */}
      <div className="flex flex-col gap-2">
        {availableImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
              currentIndex === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Image
              src={image}
              alt={`${productNameStr} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Right Column - Main Image */}
      <div className="col-span-3 relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={availableImages[currentIndex]}
          alt={`${productNameStr} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
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
