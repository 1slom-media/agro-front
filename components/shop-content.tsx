"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CalculatorModal } from "@/components/calculator-modal"
import { useI18n } from "@/lib/i18n-context"
import { type UsageType, getDensityByTemperature } from "@/lib/products"
import { categoriesApi, dictionaryApi, productsApi } from "@/lib/api-client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface ApiProduct {
  id: string
  name: { uz: string; ru: string; en: string }
  slug: string
  price: number
  images?: {
    image1?: { url?: string; base64?: string }
    image2?: { url?: string; base64?: string }
    image3?: { url?: string; base64?: string }
  }
  specifications?: {
    temperature?: string
    density?: string
    color?: string
    size?: string
    usage?: string[]
  }
  isActive: boolean
  description?: { uz: string; ru: string; en: string }
}

export function ShopContent() {
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const initialUsage = searchParams.get("usage") as UsageType | null
  const initialCategory = searchParams.get("category")

  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [calculatorUsage, setCalculatorUsage] = useState<UsageType>("open_field")
  const [calculatorCategory, setCalculatorCategory] = useState<string>("")
  const [calculatorProduct, setCalculatorProduct] = useState<any>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || "all")
  const [densityFilter, setDensityFilter] = useState<string>("all")
  const [temperatureFilter, setTemperatureFilter] = useState<string>("all")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [filtersDict, setFiltersDict] = useState<any>(null)
  const [colorDict, setColorDict] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes, dictRes] = await Promise.all([
        productsApi.getAll({ page: 1, limit: 100 }),
        categoriesApi.getAll({ page: 1, limit: 100 }),
        dictionaryApi.getFilters(),
      ])

      const activeProducts = (productsRes.data || []).filter((p: ApiProduct) => p.isActive)
      setProducts(activeProducts)
      setCategories((categoriesRes.data || []).filter((c: any) => c.isActive))
      setFiltersDict(dictRes || null)
      setColorDict(dictRes?.color || [])
    } catch (error) {
      console.error("Failed to load products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCalculator = (usage?: UsageType, product?: ApiProduct) => {
    if (usage) setCalculatorUsage(usage)
    if (product) {
      setCalculatorProduct({
        id: product.id,
        price: product.price,
        categoryId: (product as any).categoryId || (product as any).category?.id,
      })
      if ((product as any).categoryId || (product as any).category?.id) {
        setCalculatorCategory((product as any).categoryId || (product as any).category?.id)
      }
    } else {
      setCalculatorProduct(null)
      setCalculatorCategory("")
    }
    setCalculatorOpen(true)
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product: ApiProduct) => {
      if (categoryFilter !== "all" && (product as any).category?.slug !== categoryFilter && (product as any).categoryId !== categoryFilter) {
        return false
      }
      const density = product.specifications?.density ? Number.parseInt(product.specifications.density) : 0
      if (densityFilter !== "all" && density !== Number.parseInt(densityFilter)) {
        return false
      }
      if (temperatureFilter !== "all") {
        const productTemperature = product.specifications?.temperature
        if (!productTemperature || productTemperature !== temperatureFilter) {
          return false
        }
      }
      return true
    })
  }, [products, categoryFilter, densityFilter, temperatureFilter])

  const clearFilters = () => {
    setCategoryFilter("all")
    setDensityFilter("all")
    setTemperatureFilter("all")
  }

  const hasActiveFilters = categoryFilter !== "all" || densityFilter !== "all" || temperatureFilter !== "all"

  const densities = (filtersDict?.density || [])
    .map((d: any) => d.value)
    .filter((v: any) => v !== undefined && v !== null && v !== "")

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.shop.category}</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.shop.all}</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name?.[locale] || cat.name?.ru || cat.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.shop.density}</Label>
        <Select value={densityFilter} onValueChange={setDensityFilter}>
          <SelectTrigger className="cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.shop.all}</SelectItem>
            {densities.map((density: any) => (
              <SelectItem key={density} value={density.toString()}>
                {density} {t.common.gm2}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.shop.temperature}</Label>
        <Select value={temperatureFilter} onValueChange={setTemperatureFilter}>
          <SelectTrigger className="cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.shop.all}</SelectItem>
            {(filtersDict?.temperature || []).map((opt: any) => (
              <SelectItem key={opt.id || opt.value} value={opt.value}>
                {opt.label?.[locale] || opt.label?.ru || opt.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters} className="w-full justify-center text-muted-foreground cursor-pointer">
          <X className="h-4 w-4 mr-2" />
          Clear filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenCalculator={() => handleOpenCalculator()} />

      <main className="flex-1 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{t.shop.title}</h1>

            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden bg-transparent cursor-pointer">
                  <Filter className="h-4 w-4 mr-2" />
                  {t.shop.filters}
                  {hasActiveFilters && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">!</span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>{t.shop.filters}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  {t.shop.filters}
                </h2>
                <FilterContent />
              </div>
            </aside>

            <div className="flex-1">
              {loading ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">{t.common.loading || "Loading..."}</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product: ApiProduct) => {
                    const usage = product.specifications?.usage || []
                    // Parse size (e.g., "1,3х200" -> width: 1.3, length: 200)
                    let width = 3.2
                    let length = 100
                    if (product.specifications?.size) {
                      const sizeMatch = product.specifications.size.match(/([\d,\.]+)\s*[xх]\s*(\d+)/i)
                      if (sizeMatch) {
                        width = parseFloat(sizeMatch[1].replace(',', '.'))
                        length = parseInt(sizeMatch[2])
                      }
                    }
                    
                    // Find color label from dictionary
                    const colorValue = product.specifications?.color || ""
                    const colorItem = colorDict.find((c: any) => c.value === colorValue)
                    const colorLabel = colorItem?.label?.[locale] || colorItem?.label?.ru || colorValue || ""
                    
                    // Get size label from dictionary if available
                    let sizeLabel = product.specifications?.size || ""
                    if (sizeLabel && filtersDict?.size) {
                      const sizeItem = filtersDict.size.find((s: any) => s.value === sizeLabel)
                      if (sizeItem) {
                        sizeLabel = sizeItem.label?.[locale] || sizeItem.label?.ru || sizeLabel
                      } else {
                        // If not found in dictionary, use the value as is (e.g., "1,3х200 м")
                        sizeLabel = sizeLabel.includes("м") ? sizeLabel : `${sizeLabel} ${t.common.m}`
                      }
                    } else if (sizeLabel) {
                      // If no dictionary but size exists, format it
                      sizeLabel = sizeLabel.includes("м") ? sizeLabel : `${sizeLabel} ${t.common.m}`
                    } else if (width && length) {
                      // Fallback to width × length format
                      sizeLabel = `${width} × ${length}`
                    }
                    
                    const productForCard = {
                      id: product.id,
                      name: product.name[locale] || product.name.ru,
                      slug: product.slug,
                      type: usage.includes("mulch") ? "mulch" as const : "cover" as const,
                      usage: (usage.length > 0 ? usage : ["open_field"]) as UsageType[],
                      color: colorValue as "white" | "black" | string,
                      colorLabel: colorLabel,
                      density: product.specifications?.density ? Number.parseInt(product.specifications.density) : 17,
                      width: width,
                      length: length,
                      size: sizeLabel || (width && length ? `${width} × ${length}` : ""),
                      price: product.price || 0,
                      image: product.images?.image1?.url || product.images?.image1?.base64 || "/placeholder.svg",
                      description: product.description || { uz: "", ru: "", en: "" },
                    }
                    return (
                    <ProductCard
                      key={product.id}
                        product={productForCard}
                        onCalculate={() => handleOpenCalculator((usage[0] || "open_field") as UsageType, product)}
                    />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">{t.calculator.noProduct}</p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent cursor-pointer">
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer onOpenCalculator={() => handleOpenCalculator()} />

      <CalculatorModal 
        open={calculatorOpen} 
        onOpenChange={setCalculatorOpen} 
        initialCategory={calculatorCategory}
        initialProduct={calculatorProduct}
      />
    </div>
  )
}
