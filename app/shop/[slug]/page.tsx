"use client"

import type React from "react"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalculatorModal } from "@/components/calculator-modal"
import { StructuredData } from "@/components/structured-data"
import { ProductGallery } from "@/components/product-gallery"
import { useI18n } from "@/lib/i18n-context"
import type { UsageType } from "@/lib/products"
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/structured-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calculator, ShoppingCart, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { applicationsApi, productsApi, dictionaryApi } from "@/lib/api-client"

interface ApiProduct {
  id: string
  name: { uz: string; ru: string; en: string }
  slug: string
  price: number
  categoryId?: string
  images?: {
    image1?: { url?: string; base64?: string }
  }
  description: { uz: string; ru: string; en: string }
  specifications?: {
    temperature?: string
    density?: string
    width?: string
    length?: string
    size?: string
    sellType?: string
    usage?: UsageType[]
    color?: "white" | "black"
  }
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t, locale } = useI18n()
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [meters, setMeters] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [productLoading, setProductLoading] = useState(true)
  const [colorDict, setColorDict] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [data, dictRes] = await Promise.all([
          productsApi.getBySlug(slug),
          dictionaryApi.getFilters(),
        ])
        setProduct(data)
        setColorDict(dictRes?.color || [])
      } catch (e) {
        console.error("Failed to load product", e)
        notFound()
      } finally {
        setProductLoading(false)
      }
    }
    load()
  }, [slug])

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">{t.common.loading}</span>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const handleOpenCalculator = () => {
    setCalculatorOpen(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US").format(price)
  }

  // Format phone number to standard format
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // If starts with 998, keep it
    if (digits.startsWith('998')) {
      return `+${digits}`
    }
    // If starts with 8, replace with +998
    if (digits.startsWith('8')) {
      return `+998${digits.slice(1)}`
    }
    // If starts with 9, add +998
    if (digits.startsWith('9') && digits.length === 9) {
      return `+998${digits}`
    }
    // If already has country code
    if (digits.length >= 12) {
      return `+${digits}`
    }
    // Default: add +998
    return `+998${digits}`
  }

  // Validate phone number
  const validatePhone = (value: string): boolean => {
    const digits = value.replace(/\D/g, '')
    // Should be 12 digits (998 + 9 digits) or 9 digits (local format)
    return (digits.length === 12 && digits.startsWith('998')) || digits.length === 9
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    
    if (value && !validatePhone(value)) {
      setPhoneError(locale === "uz" ? "Telefon raqami noto'g'ri" : locale === "ru" ? "Неверный номер телефона" : "Invalid phone number")
    } else {
      setPhoneError(null)
    }
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate phone
    if (!phone || !validatePhone(phone)) {
      setPhoneError(locale === "uz" ? "Telefon raqamini kiriting" : locale === "ru" ? "Введите номер телефона" : "Enter phone number")
      setLoading(false)
      return
    }

    const formattedPhone = formatPhoneNumber(phone)
    const orderMessage = t.product.orderMessage(product.name[locale], `${meters} ${t.common.m}`)

    try {
      await applicationsApi.create({
        name,
        phone: formattedPhone,
        message: orderMessage,
        type: "quote",
        metadata: {
          productName: product.name[locale],
          productSlug: product.slug,
          quantity: meters,
        },
      })

      setOrderSubmitted(true)
      setTimeout(() => {
        setOrderSubmitted(false)
        setMeters("")
        setName("")
        setPhone("")
      }, 5000)
    } catch (err: any) {
      console.error("Failed to submit order:", err)
      setError(err.message || "Failed to submit order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const usageLabels: Record<UsageType, string> = {
    greenhouse: t.usage.greenhouse.title,
    open_field: t.usage.openField.title,
    mulch: t.usage.mulch.title,
  }

  const faqItems = [
    {
      question: {
        uz: "Bu mahsulot qancha vaqt xizmat qiladi?",
        ru: "Сколько прослужит этот материал?",
        en: "How long will this material last?",
      },
      answer: {
        uz: "To'g'ri saqlash va foydalanishda 3-5 yil xizmat qiladi.",
        ru: "При правильном хранении и использовании материал служит 3-5 лет.",
        en: "With proper storage and use, the material lasts 3-5 years.",
      },
    },
    {
      question: {
        uz: "Yetkazib berish qanday amalga oshiriladi?",
        ru: "Как осуществляется доставка?",
        en: "How is delivery carried out?",
      },
      answer: {
        uz: "Toshkent bo'ylab bepul yetkazib berish. Viloyatlarga qo'shimcha haq evaziga.",
        ru: "Бесплатная доставка по Ташкенту. В регионы за дополнительную плату.",
        en: "Free delivery in Tashkent. Delivery to regions for an additional fee.",
      },
    },
    {
      question: {
        uz: "Materialning rangini tanlash mumkinmi?",
        ru: "Можно ли выбрать цвет материала?",
        en: "Can I choose the color of the material?",
      },
      answer: {
        uz: "Qoplama materiallar oq rangda, mulch materiallar qora rangda mavjud.",
        ru: "Укрывные материалы доступны в белом цвете, мульчирующие - в черном.",
        en: "Cover materials are available in white, mulch materials in black.",
      },
    },
  ]

  // Generate structured data for SEO
  const productSchema = generateProductSchema(
    {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      description: product.description,
      images: product.images,
    },
    locale,
  )
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t.nav.allProducts, url: "/shop" },
    { name: product.name[locale] },
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData data={[productSchema, breadcrumbSchema]} />
      <Header onOpenCalculator={handleOpenCalculator} />

      <main className="flex-1 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.nav.allProducts}
          </Link>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Product Gallery */}
            <ProductGallery
              images={product.images || {}}
              productName={product.name}
            />

            {/* Product Info */}
            <div>
              <div className="flex gap-2 mb-4">
                {product.specifications?.color && (() => {
                  const colorItem = colorDict.find((c: any) => c.value === product.specifications?.color)
                  const colorLabel = colorItem?.label?.[locale] || colorItem?.label?.ru || product.specifications.color
                  return (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.specifications.color === "white"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-foreground text-background"
                      }`}
                    >
                      {colorLabel}
                    </span>
                  )
                })()}
                {product.specifications?.density && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {product.specifications.density} {t.common.gm2}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2 line-clamp-2 break-words">{product.name[locale]}</h1>

              <p className="text-muted-foreground mb-4 text-sm">{product.description[locale]}</p>

              <div className="text-2xl font-bold text-primary mb-4">
                {formatPrice(product.price)} {t.common.sum}
                <span className="text-sm font-normal text-muted-foreground ml-2">/ {t.shop.perRoll}</span>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold mb-3 text-sm">{t.product.specifications}</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {product.specifications.density && (
                      <div>
                        <span className="text-muted-foreground">{t.product.density}:</span>
                        <p className="font-medium">
                          {product.specifications.density} {t.common.gm2}
                        </p>
                      </div>
                    )}
                    {product.specifications.color && (() => {
                      const colorItem = colorDict.find((c: any) => c.value === product.specifications.color)
                      const colorLabel = colorItem?.label?.[locale] || colorItem?.label?.ru || product.specifications.color
                      return (
                        <div>
                          <span className="text-muted-foreground">{t.product.color}:</span>
                          <p className="font-medium">{colorLabel}</p>
                        </div>
                      )
                    })()}
                    {product.specifications.size && (
                      <div>
                        <span className="text-muted-foreground">{locale === 'uz' ? 'O\'lcham' : 'Размер'}:</span>
                        <p className="font-medium">
                          {product.specifications.size} {t.common.m}
                        </p>
                      </div>
                    )}
                    {product.specifications.temperature && (
                      <div>
                        <span className="text-muted-foreground">{locale === 'uz' ? 'Harorat' : 'Температура'}:</span>
                        <p className="font-medium">
                          {locale === 'uz' ? 'до' : locale === 'ru' ? 'до' : 'up to'} {product.specifications.temperature}°C
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Usage */}
              {product.specifications?.usage && product.specifications.usage.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">{t.product.usage}:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.specifications.usage.map((u: UsageType) => (
                      <span key={u} className="px-3 py-1 bg-secondary rounded-full text-sm">
                        {usageLabels[u]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button size="lg" onClick={handleOpenCalculator} variant="outline" className="flex-1 bg-transparent">
                  <Calculator className="h-5 w-5 mr-2" />
                  {t.shop.calculate}
                </Button>
                <Button size="lg" className="flex-1" asChild>
                  <a href="#order-form">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {t.shop.buy}
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <section className="mt-12 lg:mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">{t.product.examples}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="/greenhouse-with-white-agrofiber-cover-plants.jpg"
                  alt="Greenhouse example"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="/open-field-crops-covered-with-white-agricultural-f.jpg"
                  alt="Open field example"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="/black-mulch-fabric-in-garden-weed-control.jpg"
                  alt="Mulch example"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-12 lg:mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">{t.product.faq}</h2>
            <Accordion type="single" collapsible className="bg-card rounded-xl border border-border">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="px-6 hover:no-underline">{item.question[locale]}</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">{item.answer[locale]}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Order Form */}
          <section id="order-form" className="mt-12 lg:mt-16 max-w-xl mx-auto">
            <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
              <h2 className="font-serif text-2xl font-bold mb-2 text-center">{t.product.orderForm}</h2>
              <p className="text-muted-foreground text-center mb-6">{product.name[locale]}</p>

              {orderSubmitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-semibold text-lg">
                    {locale === "uz" && "Buyurtma qabul qilindi!"}
                    {locale === "ru" && "Заказ принят!"}
                    {locale === "en" && "Order received!"}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="meters">{t.product.meters}</Label>
                    <Input
                      id="meters"
                      type="number"
                      min="1"
                      value={meters}
                      onChange={(e) => setMeters(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.product.name}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.product.phone}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      disabled={loading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Submitting..." : t.product.submit}
                  </Button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer onOpenCalculator={handleOpenCalculator} />

      <CalculatorModal 
        open={calculatorOpen} 
        onOpenChange={setCalculatorOpen} 
        initialCategory={product.categoryId}
        initialProduct={{
          id: product.id,
          price: product.price,
          categoryId: product.categoryId,
          specifications: product.specifications,
        }}
      />
    </div>
  )
}
