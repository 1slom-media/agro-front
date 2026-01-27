"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { UsageCards } from "@/components/usage-cards"
import { FeaturesSection } from "@/components/features-section"
import { CalculatorModal } from "@/components/calculator-modal"
import { ProductCard } from "@/components/product-card"
import { BlogCard } from "@/components/blog-card"
import { ContactFormSection } from "@/components/contact-form-section"
import { type UsageType } from "@/lib/products"
import { productsApi, blogApi, dictionaryApi } from "@/lib/api-client"
import { useI18n } from "@/lib/i18n-context"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ApiProduct {
  id: string
  name: { uz: string; ru: string; en: string }
  slug: string
  price: number
  images?: {
    image1?: { url?: string; base64?: string }
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

interface ApiBlogPost {
  id: string
  title: { uz: string; ru: string; en: string }
  slug: string
  excerpt?: { uz: string; ru: string; en: string }
  featuredImageBase64?: string
  featuredImageUrl?: string
  publishedAt?: string
  isPublished: boolean
}

export default function HomePage() {
  const { t, locale } = useI18n()
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [calculatorUsage, setCalculatorUsage] = useState<UsageType>("open_field")
  const [calculatorCategory, setCalculatorCategory] = useState<string>("")
  const [calculatorProduct, setCalculatorProduct] = useState<any>(null)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [activeProducts, setActiveProducts] = useState<ApiProduct[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersDict, setFiltersDict] = useState<any>(null)
  const [colorDict, setColorDict] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [locale])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsRes, blogRes, dictRes] = await Promise.all([
        productsApi.getAll({ page: 1, limit: 8 }),
        blogApi.getAll({ page: 1, limit: 3 }),
        dictionaryApi.getFilters(),
      ])
      
      const activeProductsList = (productsRes.data || []).filter((p: ApiProduct) => p.isActive)
      const publishedPosts = (blogRes.data || []).filter((p: ApiBlogPost) => p.isPublished)
      
      setFiltersDict(dictRes || null)
      setColorDict(dictRes?.color || [])
      setActiveProducts(activeProductsList)
      
      setFeaturedProducts(activeProductsList.map((p: ApiProduct) => {
        const usage = p.specifications?.usage || []
        // Parse size (e.g., "1,3х200" -> width: 1.3, length: 200)
        let width = 3.2
        let length = 100
        if (p.specifications?.size) {
          const sizeMatch = p.specifications.size.match(/([\d,\.]+)\s*[xх]\s*(\d+)/i)
          if (sizeMatch) {
            width = parseFloat(sizeMatch[1].replace(',', '.'))
            length = parseInt(sizeMatch[2])
          }
        }
        
        // Find color label from dictionary
        const colorValue = p.specifications?.color || ""
        const colorItem = (dictRes?.color || []).find((c: any) => c.value === colorValue)
        const colorLabel = colorItem?.label?.[locale] || colorItem?.label?.ru || colorValue || ""
        
        // Get size label from dictionary if available
        let sizeLabel = p.specifications?.size || ""
        if (sizeLabel && dictRes?.size) {
          const sizeItem = dictRes.size.find((s: any) => s.value === sizeLabel)
          if (sizeItem) {
            sizeLabel = sizeItem.label?.[locale] || sizeItem.label?.ru || sizeLabel
          } else {
            // Check if already has unit (м, m, М, M at the end)
            const hasUnit = /[мmМM]\s*$/.test(sizeLabel.trim())
            sizeLabel = hasUnit ? sizeLabel : `${sizeLabel} ${t.common.m}`
          }
        } else if (sizeLabel) {
          // Check if already has unit
          const hasUnit = /[мmМM]\s*$/.test(sizeLabel.trim())
          sizeLabel = hasUnit ? sizeLabel : `${sizeLabel} ${t.common.m}`
        } else if (width && length) {
          sizeLabel = `${width} × ${length}`
        }
        
        return {
          id: p.id,
          name: p.name[locale] || p.name.ru,
          slug: p.slug,
          type: usage.includes("mulch") ? ("mulch" as const) : ("cover" as const),
          usage: (usage.length > 0 ? usage : ["open_field"]) as UsageType[],
          color: colorValue || "white",
          colorLabel: colorLabel,
          density: p.specifications?.density ? Number.parseInt(p.specifications.density) : 17,
          width: width,
          length: length,
          size: sizeLabel,
          price: p.price || 0,
          image: p.images?.image1?.url || p.images?.image1?.base64 || "/placeholder.svg",
          description: p.description || { uz: "", ru: "", en: "" },
        }
      }))
      
      setFeaturedPosts(publishedPosts.map((p: ApiBlogPost) => ({
        id: p.id,
        slug: p.slug,
        image: p.featuredImageBase64 || p.featuredImageUrl || "/placeholder.svg",
        title: p.title,
        excerpt: p.excerpt || { uz: "", ru: "", en: "" },
        date: p.publishedAt || new Date().toISOString(),
      })))
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCalculator = (usage?: UsageType, categoryId?: string, product?: any) => {
    if (usage) setCalculatorUsage(usage)
    if (categoryId) {
      setCalculatorCategory(categoryId)
    } else {
      setCalculatorCategory("")
    }
    if (product) {
      setCalculatorProduct(product)
    } else {
      setCalculatorProduct(null)
    }
    setCalculatorOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenCalculator={() => handleOpenCalculator()} />

      <main className="flex-1">
        <HeroSection onOpenCalculator={() => handleOpenCalculator()} />

        <UsageCards onSelectUsage={(usage, categoryId) => {
          handleOpenCalculator(usage, categoryId || undefined, undefined)
        }} />

        <FeaturesSection />

        {/* Featured Products - 2 rows */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1 sm:mb-2">
                  {t.footer.popularProducts}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">{t.hero.description}</p>
              </div>
              <Link href="/shop" className="hidden sm:block shrink-0">
                <Button
                  variant="outline"
                  className="bg-transparent transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer"
                >
                  {t.nav.allProducts}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  {locale === "uz" ? "Yuklanmoqda..." : locale === "ru" ? "Загрузка..." : "Loading..."}
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ProductCard 
                    product={product} 
                    onCalculate={() => {
                      // Find the original product from API response
                      const apiProduct = activeProducts.find((p: ApiProduct) => p.id === product.id)
                      if (apiProduct) {
                        handleOpenCalculator(
                          product.usage[0], 
                          (apiProduct as any).categoryId || (apiProduct as any).category?.id,
                          {
                            id: apiProduct.id,
                            price: apiProduct.price,
                            categoryId: (apiProduct as any).categoryId || (apiProduct as any).category?.id,
                            specifications: apiProduct.specifications || {},
                          }
                        )
                      } else {
                        handleOpenCalculator(product.usage[0])
                      }
                    }} 
                  />
                </div>
              ))}
            </div>
            )}

            <div className="mt-8 sm:mt-10 text-center sm:hidden">
              <Link href="/shop">
                <Button variant="outline" className="w-full bg-transparent cursor-pointer">
                  {t.nav.allProducts}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1 sm:mb-2">
                  {t.blog.title}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">Foydali maqolalar / Полезные статьи</p>
              </div>
              <Link href="/blog" className="hidden sm:block shrink-0">
                <Button
                  variant="outline"
                  className="bg-transparent transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer"
                >
                  {t.blog.readMore}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  {locale === "uz" ? "Yuklanmoqda..." : locale === "ru" ? "Загрузка..." : "Loading..."}
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredPosts.map((post, index) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
            )}

            <div className="mt-8 sm:mt-10 text-center sm:hidden">
              <Link href="/blog">
                <Button variant="outline" className="w-full bg-transparent cursor-pointer">
                  {t.blog.readMore}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <ContactFormSection />
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
