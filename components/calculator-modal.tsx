"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, ShoppingCart, ArrowRight, RotateCcw } from "lucide-react"
import Link from "next/link"
import { categoriesApi, productsApi } from "@/lib/api-client"

interface CalculatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCategory?: string
  initialProduct?: { id: string; price: number; categoryId?: string; specifications?: any }
}

interface ApiProduct {
  id: string
  name: { uz: string; ru: string; en: string }
  slug: string
  price: number
  categoryId?: string
  specifications?: {
    sellType?: string
    temperature?: string
    density?: string
    width?: string
    length?: string
    size?: string
  }
}

export function CalculatorModal({ open, onOpenChange, initialCategory, initialProduct }: CalculatorModalProps) {
  const { t, locale } = useI18n()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(false)
  
  // Input fields based on sellType
  const [length, setLength] = useState<string>("")
  const [width, setWidth] = useState<string>("")
  const [count, setCount] = useState<string>("") // For za_paket
  
  const [result, setResult] = useState<{
    rollCount: number
    totalPrice: number
    area: number
  } | null>(null)

  // Reset calculator when modal opens/closes
  useEffect(() => {
    if (open) {
      // Reset all fields
      setLength("")
      setWidth("")
      setCount("")
      setResult(null)
      
      // Set initial values if provided
      if (initialCategory) {
        setSelectedCategory(initialCategory)
      } else {
        setSelectedCategory("")
      }
      
      if (initialProduct) {
        setSelectedProduct(initialProduct as any)
        if (initialProduct.categoryId) {
          setSelectedCategory(initialProduct.categoryId)
        }
      } else {
        setSelectedProduct(null)
      }
      
      // Load data
      loadData()
    } else {
      // Reset everything when modal closes
      setSelectedCategory("")
      setSelectedProduct(null)
      setLength("")
      setWidth("")
      setCount("")
      setResult(null)
    }
  }, [open, initialCategory, initialProduct])

  // Filter products when category changes
  useEffect(() => {
    if (products.length > 0 && selectedCategory) {
      const filtered = products.filter((p) => {
        const catId = p.categoryId || (p as any).category?.id
        return catId === selectedCategory
      })
      setFilteredProducts(filtered)
      
      // If initial product is provided and matches, select it
      if (initialProduct && filtered.find(p => p.id === initialProduct.id)) {
        setSelectedProduct(initialProduct as any)
      } else if (filtered.length === 1 && !selectedProduct) {
        // Auto-select if only one product
        setSelectedProduct(filtered[0])
      } else if (selectedProduct && !filtered.find(p => p.id === selectedProduct.id)) {
        // Clear selection if product doesn't match category
        setSelectedProduct(null)
      }
    } else {
      setFilteredProducts([])
      setSelectedProduct(null)
    }
  }, [selectedCategory, products, initialProduct])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, productsRes] = await Promise.all([
        categoriesApi.getAll({ page: 1, limit: 100 }),
        productsApi.getAll({ page: 1, limit: 100 }).catch((err) => {
          console.error("Products API error:", err)
          return { data: [], total: 0, page: 1, limit: 100, totalPages: 0 }
        }),
      ])

      // Handle categories
      const categoriesList = categoriesRes?.data || []
      const activeCategories = categoriesList.filter((c: any) => {
        if (!c) return false
        return c.isActive === true || c.isActive === undefined
      })
      setCategories(activeCategories)

      // Handle products
      const productsList = productsRes?.data || []
      const activeProducts = productsList.filter((p: ApiProduct) => {
        if (!p) return false
        return p.isActive === true || p.isActive === undefined || p.isActive === null
      })
      setProducts(activeProducts)
    } catch (error) {
      console.error("Failed to load calculator data:", error)
      setCategories([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = (productId: string) => {
    const product = filteredProducts.find((p) => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      if (product.categoryId) {
        setSelectedCategory(product.categoryId)
      }
      // Reset input fields when product changes
      setLength("")
      setWidth("")
      setCount("")
      setResult(null)
    }
  }

  const handleCalculate = () => {
    if (!selectedProduct) {
      alert(locale === "uz" ? "Mahsulot tanlanishi kerak" : locale === "ru" ? "Необходимо выбрать продукт" : "Product must be selected")
      return
    }

    const sellType = selectedProduct.specifications?.sellType || "za_rulot"

    if (sellType === "za_paket") {
      // For za_paket: count * price
      if (!count || Number.parseFloat(count) <= 0) {
        alert(locale === "uz" ? "Miqdorni kiriting" : locale === "ru" ? "Введите количество" : "Enter count")
        return
      }

      const packageCount = Math.ceil(Number.parseFloat(count))
      const totalPrice = packageCount * selectedProduct.price

      setResult({
        rollCount: packageCount,
        totalPrice,
        area: packageCount,
      })
    } else {
      // For za_rulot: calculate based on area
      const areaLength = Number.parseFloat(length) || 0
      const areaWidth = Number.parseFloat(width) || 0

      if (areaLength <= 0 || areaWidth <= 0) {
        alert(locale === "uz" ? "Uzunlik va eni kiritilishi kerak" : locale === "ru" ? "Необходимо указать длину и ширину" : "Length and width must be entered")
        return
      }

      // Parse product dimensions from specifications
      // Size format: "3,2х500" or width/length separately
      let productWidth = 0
      let productLength = 0
      
      if (selectedProduct.specifications?.size) {
        // Parse size like "3,2х500" or "3.2x500"
        const sizeMatch = selectedProduct.specifications.size.match(/([\d,\.]+)\s*[xх]\s*(\d+)/i)
        if (sizeMatch) {
          productWidth = parseFloat(sizeMatch[1].replace(',', '.'))
          productLength = parseFloat(sizeMatch[2])
        }
      }
      
      // Fallback to separate width/length fields if size not available
      if (productWidth === 0 || productLength === 0) {
        productWidth = Number.parseFloat(selectedProduct.specifications?.width?.replace(',', '.') || "3.2")
        productLength = Number.parseFloat(selectedProduct.specifications?.length?.replace(',', '.') || "100")
      }

      if (productWidth <= 0 || productLength <= 0) {
        alert(locale === "uz" ? "Mahsulot o'lchamlari noto'g'ri" : locale === "ru" ? "Неверные размеры продукта" : "Invalid product dimensions")
        return
      }

      // Calculate: how many rolls needed along the length direction
      // If area length is 1000m and product length is 500m, we need 2 rolls
      const rollsNeededForLength = Math.ceil(areaLength / productLength)
      
      // Calculate: how many rows needed along the width direction
      // If area width is 3.2m and product width is 3.2m, we need 1 row
      const rowsNeededForWidth = Math.ceil(areaWidth / productWidth)
      
      // Total rolls = rolls along length * rows along width
      const rollCount = rollsNeededForLength * rowsNeededForWidth
      const area = areaLength * areaWidth
      const totalPrice = rollCount * selectedProduct.price

      setResult({
        rollCount,
        totalPrice,
        area,
      })
    }
  }

  const handleReset = () => {
    setSelectedCategory("")
    setSelectedProduct(null)
    setLength("")
    setWidth("")
    setCount("")
    setResult(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US").format(price)
  }

  const sellType = selectedProduct?.specifications?.sellType || "za_rulot"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-5 w-5 text-primary" />
            {t.calculator.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{t.calculator.subtitle}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Selection - Always visible */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {locale === "uz" ? "Kategoriya" : locale === "ru" ? "Категория" : "Category"}
            </Label>
            <Select 
              value={selectedCategory || undefined} 
              onValueChange={(value) => {
                setSelectedCategory(value)
                setSelectedProduct(null) // Clear product when category changes
                setResult(null)
              }} 
              disabled={loading || categories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  loading 
                    ? (locale === "uz" ? "Yuklanmoqda..." : locale === "ru" ? "Загрузка..." : "Loading...")
                    : categories.length === 0
                    ? (locale === "uz" ? "Kategoriyalar topilmadi" : locale === "ru" ? "Категории не найдены" : "No categories found")
                    : (locale === "uz" ? "Kategoriyani tanlang" : locale === "ru" ? "Выберите категорию" : "Select category")
                } />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    {locale === "uz" ? "Kategoriyalar mavjud emas" : locale === "ru" ? "Категории недоступны" : "No categories available"}
                  </div>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name?.[locale] || cat.name?.ru || cat.name?.uz || cat.name?.en || cat.slug || "Unnamed Category"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Product Selection - Always visible when category is selected */}
          {selectedCategory && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {locale === "uz" ? "Mahsulot" : locale === "ru" ? "Продукт" : "Product"}
              </Label>
              <Select 
                value={selectedProduct?.id || ""} 
                onValueChange={handleProductSelect}
                disabled={filteredProducts.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    filteredProducts.length === 0
                      ? (locale === "uz" ? "Mahsulotlar topilmadi" : locale === "ru" ? "Продукты не найдены" : "No products found")
                      : (locale === "uz" ? "Mahsulotni tanlang" : locale === "ru" ? "Выберите продукт" : "Select product")
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredProducts.map((product) => {
                    const productName = product.name?.[locale] || product.name?.ru || ""
                    const displayName = productName.length > 40 ? productName.slice(0, 40) + "..." : productName
                    return (
                      <SelectItem key={product.id} value={product.id} className="truncate">
                        <span className="truncate block">{displayName} - {formatPrice(product.price)} {t.common.sum}</span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Input fields based on sellType */}
          {selectedProduct && (
            <>
              {sellType === "za_paket" ? (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {locale === "uz" ? "Miqdor" : locale === "ru" ? "Количество" : "Count"}
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    placeholder={locale === "uz" ? "Paketlar sonini kiriting" : locale === "ru" ? "Введите количество пакетов" : "Enter package count"}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t.calculator.step3}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length" className="text-xs text-muted-foreground">
                        {t.calculator.length}
                      </Label>
                      <Input
                        id="length"
                        type="number"
                        min="1"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width" className="text-xs text-muted-foreground">
                        {t.calculator.width}
                      </Label>
                      <Input
                        id="width"
                        type="number"
                        min="0.5"
                        step="0.1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          {selectedProduct && (
            <div className="flex gap-2">
              <Button onClick={handleCalculate} className="flex-1" size="lg">
                <Calculator className="h-4 w-4 mr-2" />
                {t.calculator.calculate}
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Result */}
          {result && selectedProduct && (
            <div className="rounded-lg border bg-secondary/30 p-4 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                {t.calculator.result}
              </h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {sellType === "za_paket" ? (
                  <>
                    <div>
                      <span className="text-muted-foreground">
                        {locale === "uz" ? "Miqdor" : locale === "ru" ? "Количество" : "Quantity"}:
                      </span>
                      <p className="font-semibold text-primary">{result.rollCount}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-muted-foreground">
                        {locale === "uz" ? "Maydon" : locale === "ru" ? "Площадь" : "Area"}:
                      </span>
                      <p className="font-semibold">
                        {result.area.toFixed(2)} м²
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.calculator.rollsNeeded}:</span>
                      <p className="font-semibold text-primary">{result.rollCount}</p>
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <span className="text-muted-foreground">{t.calculator.totalPrice}:</span>
                  <p className="font-semibold text-primary text-lg">
                    {formatPrice(result.totalPrice)} {t.common.sum}
                  </p>
                </div>
              </div>

              <Link href={`/shop/${selectedProduct.slug}`} onClick={() => onOpenChange(false)}>
                <Button className="w-full mt-2">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t.calculator.buyNow}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
