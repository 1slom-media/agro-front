"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n-context"
import { Leaf, Calculator, Phone, Mail, MapPin, Send, Instagram, Facebook } from "lucide-react"
import { productsApi } from "@/lib/api-client"

interface FooterProps {
  onOpenCalculator?: () => void
}

type FooterProduct = {
  id: string
  slug: string
  price?: number
  isActive?: boolean
  name: { uz: string; ru: string; en: string } | string
}

export function Footer({ onOpenCalculator }: FooterProps) {
  const { t, locale } = useI18n()
  const [popularProducts, setPopularProducts] = useState<FooterProduct[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        // Lightweight: only 5 items. Cached in api-client for public GET.
        const res = await productsApi.getAll({ page: 1, limit: 5 })
        const items = (res?.data || [])
          .filter((p: FooterProduct) => p?.isActive !== false)
          .slice(0, 5)
        if (mounted) setPopularProducts(items)
      } catch {
        // Silent: footer should never break the page
        if (mounted) setPopularProducts([])
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US").format(price)

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group cursor-pointer">
              <Image
                src="/black_logo.svg"
                alt="SunAgro"
                width={180}
                height={64}
                loading="lazy"
                className="h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {locale === "uz" && "SunAgro - O'zbekistondagi professional agrovolokno yetkazib beruvchi"}
              {locale === "ru" && "SunAgro - профессиональный поставщик агроволокна в Узбекистане"}
              {locale === "en" && "SunAgro - professional agrofiber supplier in Uzbekistan"}
            </p>

            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href="https://t.me/agrotola"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/agrovolokno.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@sunagro.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-white/50 rounded-full" />
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop?category=yopuvchi-material"
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
                  {locale === "uz" && "Yopuvchi material"}
                  {locale === "ru" && "Укрывной материал"}
                  {locale === "en" && "Cover material"}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=mulch"
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
                  {locale === "uz" && "Mulcha"}
                  {locale === "ru" && "Мульча"}
                  {locale === "en" && "Mulch"}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
                  {t.nav?.shop || (locale === "ru" ? "Каталог" : locale === "uz" ? "Katalog" : "Shop")}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => onOpenCalculator?.()}
                  className="text-background/70 hover:text-background hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group cursor-pointer"
                >
                  <Calculator className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  {t.footer.calculator}
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Products */}
          <div>
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-white/50 rounded-full" />
              {t.footer.popularProducts}
            </h3>
            {popularProducts.length > 0 ? (
              <ul className="space-y-3">
                {popularProducts.map((p) => {
                  const name =
                    typeof p.name === "string" ? p.name : p.name?.[locale] || (p.name as any)?.ru || (p.name as any)?.uz || (p.name as any)?.en
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/shop/${p.slug}`}
                        className="text-white/70 hover:text-white transition-colors text-sm flex flex-col cursor-pointer"
                      >
                        <span className="line-clamp-1">{name}</span>
                        {typeof p.price === "number" && p.price > 0 && (
                          <span className="text-white/50 text-xs">{formatPrice(p.price)} {t.common.sum}</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
                <li className="pt-1">
                  <Link href="/shop" className="text-white/70 hover:text-white underline text-sm cursor-pointer">
                    {locale === "uz" ? "Barchasini ko‘rish" : locale === "ru" ? "Смотреть все" : "View all"}
                  </Link>
                </li>
              </ul>
            ) : (
              <p className="text-white/70 text-sm leading-relaxed">
                {locale === "uz" && "Mashhur mahsulotlarni katalogdan ko‘rishingiz mumkin."}
                {locale === "ru" && "Популярные товары смотрите в каталоге."}
                {locale === "en" && "See popular products in the catalog."}
              </p>
            )}
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-white/50 rounded-full" />
              {t.footer.contacts}
            </h3>
            <ul className="space-y-4">
              <li className="group">
                <a
                  href="tel:+998909665800"
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-all duration-300 hover:translate-x-1 cursor-pointer"
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>+998 90 966 58 00</span>
                </a>
              </li>
              <li className="group">
                <a
                  href="mailto:info@sunagro.uz"
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-all duration-300 hover:translate-x-1 cursor-pointer"
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="break-all">info@sunagro.uz</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <div className="bg-white/10 p-2 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="mt-2">
                  {locale === "uz" && "Toshkent, O'zbekiston"}
                  {locale === "ru" && "Ташкент, Узбекистан"}
                  {locale === "en" && "Tashkent, Uzbekistan"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60 text-center sm:text-left">
              © {new Date().getFullYear()} SunAgro. {t.footer.rights}.
            </p>
            <div className="flex gap-4 text-xs text-white/50">
              <Link href="/privacy" className="hover:text-white/70 transition-colors cursor-pointer">
                {locale === "uz" ? "Maxfiylik" : locale === "ru" ? "Конфиденциальность" : "Privacy"}
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white/70 transition-colors cursor-pointer">
                {locale === "uz" ? "Shartlar" : locale === "ru" ? "Условия" : "Terms"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
