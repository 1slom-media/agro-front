"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Info } from "lucide-react"
import { categoriesApi, productsApi } from "@/lib/api-client"
import { 
  getDensityByTemperature, 
  getDensityLabelByTemperature,
  type MaterialType,
  type CalculationMethod 
} from "@/lib/calculator-config"

interface CalculatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCategory?: string
  initialProduct?: { 
    id: string
    price: number
    categoryId?: string
    specifications?: {
      temperature?: string
      density?: string
      size?: string
      width?: string
      length?: string
    }
  }
}

interface ApiProduct {
  id: string
  name: { uz: string; ru: string; en: string }
  slug: string
  price: number
  categoryId?: string
  specifications?: {
    temperature?: string
    density?: string
    size?: string
    width?: string
    length?: string
  }
}

interface CalculationResult {
  totalArea: number // m²
  rollCount: number
  totalPrice: number
  selectedProduct: ApiProduct | null
  categorySlug: string
  materialType?: MaterialType
  calculationMethod?: CalculationMethod
  temperature?: number
  recommendedDensity?: number
  densityLabel?: string
  message?: string
}

export function CalculatorModal({ open, onOpenChange, initialCategory, initialProduct }: CalculatorModalProps) {
  const { t, locale } = useI18n()
  
  // Determine if this is product-based calculation
  const isProductBased = !!initialProduct
  
  // Step management
  const [currentStep, setCurrentStep] = useState<number>(1)
  const totalSteps = isProductBased ? 2 : 5 // Product-based: 2 steps, General: 5 steps

  // General calculation states
  const [materialType, setMaterialType] = useState<MaterialType | "">("")
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod | "">("")
  const [categorySlug, setCategorySlug] = useState<string>("")
  const [categories, setCategories] = useState<any[]>([])
  const [temperature, setTemperature] = useState<string>("")
  
  // Input data
  const [length, setLength] = useState<string>("")
  const [width, setWidth] = useState<string>("")
  // For beds
  const [bedWidth, setBedWidth] = useState<string>("")
  const [bedLength, setBedLength] = useState<string>("")
  const [bedCount, setBedCount] = useState<string>("")

  // Product selection (for general calculation)
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null)
  const [availableProducts, setAvailableProducts] = useState<ApiProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Result
  const [result, setResult] = useState<CalculationResult | null>(null)

  // Load categories on mount
  useEffect(() => {
    if (open && !isProductBased) {
      loadCategories()
    }
  }, [open, isProductBased])

  // Load products when category and temperature are selected (general calculation)
  useEffect(() => {
    if (open && !isProductBased && categorySlug && temperature && materialType === "cover") {
      loadProductsByCategoryAndTemperature()
    }
  }, [open, categorySlug, temperature, materialType, isProductBased])

  // Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      // Reset to initial state
      setCurrentStep(1)
      setMaterialType("")
      setCalculationMethod("")
      setCategorySlug("")
      setTemperature("")
      setLength("")
      setWidth("")
      setBedWidth("")
      setBedLength("")
      setBedCount("")
      setSelectedProduct(null)
      setAvailableProducts([])
      setResult(null)
    }
  }, [open])

  const loadCategories = async () => {
    try {
      const res = await categoriesApi.getAll({ page: 1, limit: 100 })
      const activeCategories = (res.data || []).filter((c: any) => c.isActive)
      // Filter only yopuvchi-material and mulch categories
      const filteredCategories = activeCategories.filter((c: any) => 
        c.slug === "yopuvchi-material" || c.slug === "mulch"
      )
      setCategories(filteredCategories)
    } catch (error) {
      console.error("Failed to load categories:", error)
      setCategories([])
    }
  }

  const loadProductsByCategoryAndTemperature = async () => {
    if (!categorySlug || !temperature) return

    try {
      setLoadingProducts(true)
      const res = await productsApi.getAll({ page: 1, limit: 100 })
      const allProducts = (res.data || []).filter((p: ApiProduct) => p.isActive)
      
      // Find category by slug
      const category = categories.find((c: any) => c.slug === categorySlug)
      if (!category) {
        setAvailableProducts([])
        return
      }

      // Filter products by category and temperature
      const temp = Number.parseFloat(temperature)
      const filtered = allProducts.filter((p: ApiProduct) => {
        // Check category match
        const productCategoryId = p.categoryId || (p as any).category?.id
        if (productCategoryId !== category.id) return false

        // Check temperature match
        if (p.specifications?.temperature) {
          const productTempMatch = p.specifications.temperature.match(/-?\d+/)
          if (productTempMatch) {
            const productTemp = Number.parseFloat(productTempMatch[0])
            // Allow some tolerance (±1°C)
            return Math.abs(productTemp - temp) <= 1
          }
        }
        return false
      })

      setAvailableProducts(filtered)
      
      // Auto-select if only one product
      if (filtered.length === 1) {
        setSelectedProduct(filtered[0])
      } else {
        setSelectedProduct(null)
      }
    } catch (error) {
      console.error("Failed to load products:", error)
      setAvailableProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleNext = () => {
    if (isProductBased) {
      // Product-based flow: only input dimensions
      if (currentStep === 1) {
        const len = Number.parseFloat(length)
        const wid = Number.parseFloat(width)
        if (!len || len <= 0 || !wid || wid <= 0) {
          alert(locale === "uz" ? "Uzunlik va eni kiritilishi kerak" : locale === "ru" ? "Введите длину и ширину" : "Enter length and width")
          return
        }
        calculateProductBasedResult()
      }
    } else {
      // General flow
      if (currentStep === 1) {
        // Material type selection
        if (!materialType) {
          alert(locale === "uz" ? "Material turini tanlang" : locale === "ru" ? "Выберите тип материала" : "Select material type")
          return
        }
        setCurrentStep(2)
      } else if (currentStep === 2) {
        // Calculation method selection
        if (!calculationMethod) {
          alert(locale === "uz" ? "Hisoblash usulini tanlang" : locale === "ru" ? "Выберите способ расчёта" : "Select calculation method")
          return
        }
        setCurrentStep(3)
      } else if (currentStep === 3) {
        // Input data validation
        if (calculationMethod === "total_area") {
          const len = Number.parseFloat(length)
          const wid = Number.parseFloat(width)
          if (!len || len <= 0 || !wid || wid <= 0) {
            alert(locale === "uz" ? "Uzunlik va eni kiritilishi kerak" : locale === "ru" ? "Введите длину и ширину" : "Enter length and width")
            return
          }
        } else if (calculationMethod === "beds") {
          const bWidth = Number.parseFloat(bedWidth)
          const bLength = Number.parseFloat(bedLength)
          const bCount = Number.parseInt(bedCount)
          if (!bWidth || bWidth <= 0 || !bLength || bLength <= 0 || !bCount || bCount <= 0) {
            alert(locale === "uz" ? "Barcha maydonlarni to'ldiring" : locale === "ru" ? "Заполните все поля" : "Fill all fields")
            return
          }
        }
        
        // If cover material, go to temperature step
        // If mulch, calculate result
        if (materialType === "cover") {
          setCurrentStep(4)
        } else {
          calculateGeneralResult()
        }
      } else if (currentStep === 4) {
        // Temperature input (only for cover material)
        const temp = Number.parseFloat(temperature)
        if (!temperature || isNaN(temp)) {
          alert(locale === "uz" ? "Temperaturani kiriting" : locale === "ru" ? "Введите температуру" : "Enter temperature")
          return
        }
        if (!selectedProduct) {
          alert(locale === "uz" ? "Mahsulotni tanlang" : locale === "ru" ? "Выберите продукт" : "Select product")
          return
        }
        calculateGeneralResult()
      }
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setResult(null)
  }

  const parseProductSize = (size: string | undefined): { width: number; length: number } => {
    if (!size) return { width: 0, length: 0 }
    
    // Parse size like "3,2х500" or "3.2x500"
    const sizeMatch = size.match(/([\d,\.]+)\s*[xх]\s*(\d+)/i)
    if (sizeMatch) {
      return {
        width: parseFloat(sizeMatch[1].replace(',', '.')),
        length: parseFloat(sizeMatch[2])
      }
    }
    return { width: 0, length: 0 }
  }

  const calculateProductBasedResult = () => {
    if (!initialProduct) {
      alert(locale === "uz" ? "Mahsulot topilmadi" : locale === "ru" ? "Продукт не найден" : "Product not found")
      return
    }

    const areaLength = Number.parseFloat(length)
    const areaWidth = Number.parseFloat(width)
    const totalArea = areaLength * areaWidth

    // Parse product size
    let productWidth = 0
    let productLength = 0

    if (initialProduct.specifications?.size) {
      const parsed = parseProductSize(initialProduct.specifications.size)
      productWidth = parsed.width
      productLength = parsed.length
    } else if (initialProduct.specifications?.width && initialProduct.specifications?.length) {
      productWidth = Number.parseFloat(initialProduct.specifications.width.replace(',', '.'))
      productLength = Number.parseFloat(initialProduct.specifications.length.replace(',', '.'))
    }

    if (productWidth <= 0 || productLength <= 0) {
      alert(locale === "uz" ? "Mahsulot o'lchamlari noto'g'ri" : locale === "ru" ? "Неверные размеры продукта" : "Invalid product dimensions")
      return
    }

    // Calculate roll count: totalArea / (productWidth * productLength)
    const rollArea = productWidth * productLength
    const rollCount = Math.ceil(totalArea / rollArea)
    const totalPrice = rollCount * initialProduct.price

    const resultData: CalculationResult = {
      totalArea,
      rollCount,
      totalPrice,
      selectedProduct: {
        id: initialProduct.id,
        name: { uz: "", ru: "", en: "" },
        slug: "",
        price: initialProduct.price,
        categoryId: initialProduct.categoryId,
        specifications: initialProduct.specifications,
      },
      categorySlug: "product",
    }

    setResult(resultData)
    setCurrentStep(totalSteps + 1) // Show result step
  }

  const calculateGeneralResult = () => {
    let calculatedArea = 0
    let message = ""

    if (calculationMethod === "total_area") {
      calculatedArea = Number.parseFloat(length) * Number.parseFloat(width)
    } else if (calculationMethod === "beds") {
      const bedArea = Number.parseFloat(bedWidth) * Number.parseFloat(bedLength)
      calculatedArea = bedArea * Number.parseInt(bedCount)
    }

    const resultData: CalculationResult = {
      totalArea: calculatedArea,
      rollCount: 0,
      totalPrice: 0,
      selectedProduct: selectedProduct,
      categorySlug: categorySlug,
      materialType: materialType as MaterialType,
      calculationMethod: calculationMethod as CalculationMethod,
    }

    if (materialType === "cover" && selectedProduct) {
      const temp = Number.parseFloat(temperature)
      const density = getDensityByTemperature(temp)
      const densityLabel = getDensityLabelByTemperature(temp)
      
      resultData.recommendedDensity = density
      resultData.densityLabel = densityLabel
      resultData.temperature = temp

      // Calculate roll count and price if product is selected
      if (selectedProduct) {
        let productWidth = 0
        let productLength = 0

        if (selectedProduct.specifications?.size) {
          const parsed = parseProductSize(selectedProduct.specifications.size)
          productWidth = parsed.width
          productLength = parsed.length
        } else if (selectedProduct.specifications?.width && selectedProduct.specifications?.length) {
          productWidth = Number.parseFloat(selectedProduct.specifications.width.replace(',', '.'))
          productLength = Number.parseFloat(selectedProduct.specifications.length.replace(',', '.'))
        }

        if (productWidth > 0 && productLength > 0) {
          const rollArea = productWidth * productLength
          resultData.rollCount = Math.ceil(calculatedArea / rollArea)
          resultData.totalPrice = resultData.rollCount * selectedProduct.price
        }
      }
    } else if (materialType === "mulch" && calculationMethod === "total_area") {
      message = locale === "uz" 
        ? "Umumiy maydon bo'yicha hisoblash yaxlit qoplash uchun mos. Yo'l bor bo'lsa, g'ildiraklar bo'yicha hisoblash tavsiya etiladi."
        : locale === "ru"
        ? "Расчёт по общей площади подходит для сплошного укрытия. При наличии дорожек рекомендуется расчёт по грядкам."
        : "Calculation by total area is suitable for continuous coverage. If there are paths, calculation by beds is recommended."
    }

    resultData.message = message
    setResult(resultData)
    setCurrentStep(totalSteps + 1) // Show result step
  }

  const handleReset = () => {
    setCurrentStep(1)
    setMaterialType("")
    setCalculationMethod("")
    setCategorySlug("")
    setTemperature("")
    setLength("")
    setWidth("")
    setBedWidth("")
    setBedLength("")
    setBedCount("")
    setSelectedProduct(null)
    setResult(null)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US").format(price)
  }

  const getCategoryName = (slug: string) => {
    const category = categories.find((c: any) => c.slug === slug)
    if (!category) return slug
    return category.name?.[locale] || category.name?.ru || category.name?.uz || category.name?.en || slug
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-5 w-5 text-primary" />
            {locale === "uz" ? "Agrovolokno kalkulyatori" : locale === "ru" ? "Калькулятор агроволокна" : "Agrofiber Calculator"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {locale === "uz" ? "Kerakli miqdorni hisoblang" : locale === "ru" ? "Рассчитайте необходимое количество" : "Calculate required quantity"}
          </p>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStep > step
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
                </div>
              </div>
              {step < totalSteps && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${
                    currentStep > step ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6 py-4">
          {/* PRODUCT-BASED CALCULATOR */}
          {isProductBased && currentStep === 1 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                {locale === "uz" ? "1. Maydon o'lchamlarini kiriting" : locale === "ru" ? "1. Введите размеры участка" : "1. Enter Plot Dimensions"}
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">
                    {locale === "uz" ? "Uzunlik (м)" : locale === "ru" ? "Длина (м)" : "Length (m)"}
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">
                    {locale === "uz" ? "Eni (м)" : locale === "ru" ? "Ширина (м)" : "Width (m)"}
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="3.2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* GENERAL CALCULATOR */}
          {!isProductBased && (
            <>
              {/* Step 1: Material Type */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    {locale === "uz" ? "1. Material turini tanlang" : locale === "ru" ? "1. Выберите тип материала" : "1. Select Material Type"}
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setMaterialType(cat.slug === "yopuvchi-material" ? "cover" : "mulch")
                          setCategorySlug(cat.slug)
                        }}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          (materialType === "cover" && cat.slug === "yopuvchi-material") ||
                          (materialType === "mulch" && cat.slug === "mulch")
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-lg font-semibold mb-2">
                          {cat.name?.[locale] || cat.name?.ru || cat.name?.uz || cat.name?.en || cat.slug}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {cat.slug === "yopuvchi-material"
                            ? (locale === "uz" ? "Issiqxona va ochiq maydonlar uchun" : locale === "ru" ? "Для теплиц и открытого грунта" : "For greenhouses and open fields")
                            : (locale === "uz" ? "Begona o'tlarni nazorat qilish" : locale === "ru" ? "Борьба с сорняками" : "Weed control")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Calculation Method */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    {locale === "uz" ? "2. Hisoblash usulini tanlang" : locale === "ru" ? "2. Выберите способ расчёта" : "2. Select Calculation Method"}
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCalculationMethod("total_area")}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        calculationMethod === "total_area"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-lg font-semibold mb-2">
                        {locale === "uz" ? "Umumiy maydon" : locale === "ru" ? "Общая площадь" : "Total Area"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {locale === "uz" ? "Maydon uzunligi va eni" : locale === "ru" ? "Длина и ширина участка" : "Plot length and width"}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalculationMethod("beds")}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        calculationMethod === "beds"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-lg font-semibold mb-2">
                        {locale === "uz" ? "G'ildiraklar bo'yicha" : locale === "ru" ? "По грядкам" : "By Beds"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {locale === "uz" ? "Har bir g'ildirak parametrlari" : locale === "ru" ? "Параметры каждой грядки" : "Each bed parameters"}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Input Data */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    {locale === "uz" ? "3. Ma'lumotlarni kiriting" : locale === "ru" ? "3. Введите данные" : "3. Enter Data"}
                  </Label>
                  
                  {calculationMethod === "total_area" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalLength">
                          {locale === "uz" ? "Uzunlik (м)" : locale === "ru" ? "Длина (м)" : "Length (m)"}
                        </Label>
                        <Input
                          id="totalLength"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          placeholder="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalWidth">
                          {locale === "uz" ? "Eni (м)" : locale === "ru" ? "Ширина (м)" : "Width (m)"}
                        </Label>
                        <Input
                          id="totalWidth"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          placeholder="3.2"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bedWidth">
                            {locale === "uz" ? "G'ildirak eni (м)" : locale === "ru" ? "Ширина грядки (м)" : "Bed Width (m)"}
                          </Label>
                          <Input
                            id="bedWidth"
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={bedWidth}
                            onChange={(e) => setBedWidth(e.target.value)}
                            placeholder="1.2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bedLength">
                            {locale === "uz" ? "G'ildirak uzunligi (м)" : locale === "ru" ? "Длина грядки (м)" : "Bed Length (m)"}
                          </Label>
                          <Input
                            id="bedLength"
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={bedLength}
                            onChange={(e) => setBedLength(e.target.value)}
                            placeholder="10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bedCount">
                          {locale === "uz" ? "G'ildiraklar soni (шт)" : locale === "ru" ? "Количество грядок (шт)" : "Number of Beds"}
                        </Label>
                        <Input
                          id="bedCount"
                          type="number"
                          min="1"
                          value={bedCount}
                          onChange={(e) => setBedCount(e.target.value)}
                          placeholder="5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Info message for mulch + total_area */}
                  {materialType === "mulch" && calculationMethod === "total_area" && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {locale === "uz"
                          ? "Umumiy maydon bo'yicha hisoblash yaxlit qoplash uchun mos. Yo'l bor bo'lsa, g'ildiraklar bo'yicha hisoblash tavsiya etiladi."
                          : locale === "ru"
                          ? "Расчёт по общей площади подходит для сплошного укрытия. При наличии дорожек рекомендуется расчёт по грядкам."
                          : "Calculation by total area is suitable for continuous coverage. If there are paths, calculation by beds is recommended."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Temperature (only for cover material) */}
              {currentStep === 4 && materialType === "cover" && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    {locale === "uz" ? "4. Temperaturani kiriting" : locale === "ru" ? "4. Введите температуру" : "4. Enter Temperature"}
                  </Label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="-5"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      {locale === "uz"
                        ? "Minimal haroratni kiriting (masalan: -5°C)"
                        : locale === "ru"
                        ? "Введите минимальную температуру (например: -5°C)"
                        : "Enter minimum temperature (e.g.: -5°C)"}
                    </p>
                  </div>

                  {/* Product selection */}
                  {temperature && (
                    <div className="space-y-2">
                      <Label>
                        {locale === "uz" ? "Mahsulotni tanlang" : locale === "ru" ? "Выберите продукт" : "Select Product"}
                      </Label>
                      {loadingProducts ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      ) : availableProducts.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          {locale === "uz" 
                            ? "Bu kategoriya va temperatura uchun mahsulot topilmadi"
                            : locale === "ru"
                            ? "Продукты для этой категории и температуры не найдены"
                            : "No products found for this category and temperature"}
                        </p>
                      ) : (
                        <Select 
                          value={selectedProduct?.id || ""} 
                          onValueChange={(value) => {
                            const product = availableProducts.find(p => p.id === value)
                            setSelectedProduct(product || null)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              locale === "uz" ? "Mahsulotni tanlang" : locale === "ru" ? "Выберите продукт" : "Select product"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {availableProducts.map((product) => {
                              const productName = product.name?.[locale] || product.name?.ru || ""
                              return (
                                <SelectItem key={product.id} value={product.id}>
                                  {productName} - {formatPrice(product.price)} {locale === "uz" ? "so'm" : locale === "ru" ? "сум" : "sum"}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Result Step */}
          {currentStep > totalSteps && result && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {locale === "uz" ? "Hisoblash natijasi" : locale === "ru" ? "Результат расчёта" : "Calculation Result"}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {locale === "uz" ? "Umumiy maydon:" : locale === "ru" ? "Общая площадь:" : "Total Area:"}
                    </span>
                    <span className="font-semibold text-lg">{formatNumber(result.totalArea)} м²</span>
                  </div>
                  
                  {!isProductBased && result.materialType && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {locale === "uz" ? "Material turi:" : locale === "ru" ? "Тип материала:" : "Material Type:"}
                      </span>
                      <span className="font-medium">
                        {result.materialType === "cover"
                          ? locale === "uz" ? "Yopish materiali" : locale === "ru" ? "Укрывной материал" : "Cover Material"
                          : locale === "uz" ? "Mulch" : locale === "ru" ? "Мульча" : "Mulch"}
                      </span>
                    </div>
                  )}
                  
                  {!isProductBased && result.calculationMethod && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {locale === "uz" ? "Hisoblash usuli:" : locale === "ru" ? "Способ расчёта:" : "Calculation Method:"}
                      </span>
                      <span className="font-medium">
                        {result.calculationMethod === "total_area"
                          ? locale === "uz" ? "Umumiy maydon" : locale === "ru" ? "Общая площадь" : "Total Area"
                          : locale === "uz" ? "G'ildiraklar bo'yicha" : locale === "ru" ? "По грядкам" : "By Beds"}
                      </span>
                    </div>
                  )}
                  
                  {result.temperature !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {locale === "uz" ? "Temperatura:" : locale === "ru" ? "Температура:" : "Temperature:"}
                      </span>
                      <span className="font-medium">{result.temperature}°C</span>
                    </div>
                  )}
                  
                  {result.recommendedDensity && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {locale === "uz" ? "Tavsiya etilgan zichlik:" : locale === "ru" ? "Рекомендуемая плотность:" : "Recommended Density:"}
                      </span>
                      <span className="font-semibold text-primary">{result.densityLabel}</span>
                    </div>
                  )}
                  
                  {result.selectedProduct && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {locale === "uz" ? "Mahsulot:" : locale === "ru" ? "Продукт:" : "Product:"}
                      </span>
                      <span className="font-medium text-right max-w-[60%] truncate">
                        {result.selectedProduct.name?.[locale] || result.selectedProduct.name?.ru || ""}
                      </span>
                    </div>
                  )}
                  
                  {result.rollCount > 0 && (
                    <>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-muted-foreground">
                          {locale === "uz" ? "Kerakli rulonlar soni:" : locale === "ru" ? "Необходимое количество рулонов:" : "Required number of rolls:"}
                        </span>
                        <span className="font-semibold text-primary text-lg">{result.rollCount}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          {locale === "uz" ? "Umumiy narx:" : locale === "ru" ? "Общая стоимость:" : "Total Price:"}
                        </span>
                        <span className="font-semibold text-primary text-xl">
                          {formatPrice(result.totalPrice)} {locale === "uz" ? "so'm" : locale === "ru" ? "сум" : "sum"}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {result.message && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex gap-2">
                        <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={currentStep > totalSteps ? handleReset : handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep > totalSteps
                ? locale === "uz" ? "Qayta hisoblash" : locale === "ru" ? "Пересчитать" : "Recalculate"
                : locale === "uz" ? "Orqaga" : locale === "ru" ? "Назад" : "Back"}
            </Button>
            
            {currentStep <= totalSteps && (
              <Button onClick={handleNext} className="flex-1" disabled={loadingProducts}>
                {locale === "uz" ? "Keyingi" : locale === "ru" ? "Далее" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
