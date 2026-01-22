"use client"

import { useState, useEffect, useCallback } from "react"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { Calculator, ArrowRight, ChevronLeft, ChevronRight, Shield, Leaf, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  onOpenCalculator: () => void
}

const heroSlides = [
  {
    image: "/agricultural-field-with-white-agrofiber-cover-gree.jpg",
    titleKey: "title" as const,
  },
  {
    image: "/greenhouse-with-agrofiber-material-covering-plants.jpg",
    titleKey: "title" as const,
  },
  {
    image: "/black-mulch-fabric-in-garden-strawberry-plants-nea.jpg",
    titleKey: "title" as const,
  },
]

export function HeroSection({ onOpenCalculator }: HeroSectionProps) {
  const { t, locale } = useI18n()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Background Slider */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-background/30 hover:bg-background/50 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:block cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-background/30 hover:bg-background/50 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:block cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? "bg-primary w-6 sm:w-8" : "bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content with animations */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="mb-8 sm:mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-3 sm:mb-4 text-balance animate-fade-in-up">
              {t.hero.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary font-medium mb-3 sm:mb-4 animate-fade-in-up animation-delay-100">
              {t.hero.subtitle}
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty animate-fade-in-up animation-delay-200 px-2">
              {t.hero.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center animate-fade-in-up animation-delay-300 px-4 sm:px-0">
              <Button
                size="lg"
                onClick={onOpenCalculator}
                className="text-base px-6 sm:px-8 py-5 sm:py-6 transition-transform duration-300 hover:scale-105 w-full sm:w-auto shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {t.hero.ctaCalculator}
              </Button>
              <Link href="/shop" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-6 sm:px-8 py-5 sm:py-6 w-full bg-background/80 backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer"
                >
                  {t.hero.ctaCatalog}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
