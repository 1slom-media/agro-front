"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Calculator, ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: Product & {
    colorLabel?: string
    size?: string
  }
  onCalculate?: () => void
}

export function ProductCard({ product, onCalculate }: ProductCardProps) {
  const { t, locale } = useI18n()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US").format(price)
  }

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-primary/30" />

      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="cursor-pointer">
        <div className="relative h-36 sm:h-44 md:h-48 lg:h-52 bg-gradient-to-br from-secondary to-secondary/50 overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1 sm:gap-2">
            {product.color && (
              <span
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                  product.color === "white"
                    ? "bg-white/90 text-gray-800 border border-gray-200"
                    : product.color === "black"
                    ? "bg-gray-900/90 text-white border border-gray-700"
                    : "bg-primary/90 text-primary-foreground border border-primary"
                }`}
              >
                {product.colorLabel || (product.color === "white" ? t.common.white : product.color === "black" ? t.common.black : product.color)}
              </span>
            )}
            {product.density && (
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-primary text-primary-foreground backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:scale-105">
                {product.density} {t.common.gm2}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 relative">
        <Link href={`/shop/${product.slug}`} className="cursor-pointer">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground group-hover:text-primary transition-colors mb-1 sm:mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Dimensions with icon */}
        {(product as any).size ? (
          <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
            <div className="w-1 h-1 rounded-full bg-primary/60" />
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {(product as any).size} {t.common.m}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
            <div className="w-1 h-1 rounded-full bg-primary/60" />
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {product.width} × {product.length} {t.common.m}
            </p>
          </div>
        )}

        {/* Price section with better visual hierarchy */}
        <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border/50">
          <div className="flex items-baseline gap-1">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary leading-none">
              {formatPrice(product.price)}
            </p>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">{t.common.sum}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{t.shop.perRoll}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col xs:flex-row gap-2">
          {onCalculate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCalculate}
              className="flex-1 bg-secondary/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-xs sm:text-sm h-9 sm:h-10 font-medium group-hover:shadow-md cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              <span className="hidden xs:inline">{t.shop.calculate}</span>
              <span className="xs:hidden">Calc</span>
            </Button>
          )}
          <Link href={`/shop/${product.slug}`} className="flex-1 cursor-pointer">
            <Button
              size="sm"
              className="w-full transition-all duration-300 hover:shadow-lg hover:scale-105 text-xs sm:text-sm h-9 sm:h-10 font-medium cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              {t.shop.buy}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
