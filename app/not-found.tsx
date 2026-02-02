"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export default function NotFound() {
  const { t, locale } = useI18n()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Translations
  const translations = {
    uz: {
      title: "Sahifa topilmadi",
      description: "Kechirasiz, siz qidirgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.",
      backHome: "Bosh sahifaga qaytish",
      viewCatalog: "Mahsulotlar katalogi",
      goBack: "Orqaga",
      helpfulLinks: "Foydali havolalar:",
      products: "Mahsulotlar",
      blog: "Blog",
      about: "Biz haqimizda",
      contact: "Aloqa",
    },
    ru: {
      title: "Страница не найдена",
      description: "Извините, запрашиваемая страница не существует или могла быть удалена.",
      backHome: "Вернуться на главную",
      viewCatalog: "Каталог товаров",
      goBack: "Назад",
      helpfulLinks: "Полезные ссылки:",
      products: "Товары",
      blog: "Блог",
      about: "О нас",
      contact: "Контакты",
    },
    en: {
      title: "Page Not Found",
      description: "Sorry, the page you are looking for does not exist or may have been removed.",
      backHome: "Back to Home",
      viewCatalog: "Product Catalog",
      goBack: "Go Back",
      helpfulLinks: "Helpful Links:",
      products: "Products",
      blog: "Blog",
      about: "About",
      contact: "Contact",
    },
  }

  const text = translations[locale] || translations.ru

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-20 lg:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl sm:text-[12rem] font-bold text-primary/20 select-none">
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-8 space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                {text.title}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
                {text.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="cursor-pointer">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  {text.backHome}
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="cursor-pointer">
                <Link href="/shop">
                  <Search className="h-4 w-4 mr-2" />
                  {text.viewCatalog}
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.history.back()}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {text.goBack}
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                {text.helpfulLinks}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/shop" className="text-primary hover:underline">
                  {text.products}
                </Link>
                <Link href="/blog" className="text-primary hover:underline">
                  {text.blog}
                </Link>
                <Link href="/about" className="text-primary hover:underline">
                  {text.about}
                </Link>
                <Link href="/contact" className="text-primary hover:underline">
                  {text.contact}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
