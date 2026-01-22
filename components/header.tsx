"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import type { Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Menu, Calculator, MessageCircle, ChevronDown, Globe, Leaf, Home, ShoppingBag, BookOpen, Mail } from "lucide-react"
import { WeatherWidget } from "@/components/weather-widget"
import { cn } from "@/lib/utils"
import { categoriesApi } from "@/lib/api-client"

interface HeaderProps {
  onOpenCalculator: () => void
}

export function Header({ onOpenCalculator }: HeaderProps) {
  const { locale, setLocale, t } = useI18n()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await categoriesApi.getAll({ page: 1, limit: 20 })
        const active = (res.data || []).filter((c: any) => c.isActive)
        setCategories(active)
      } catch (e) {
        console.error("Failed to load header categories:", e)
      }
    }
    load()
  }, [])

  const localeLabels: Record<Locale, string> = {
    uz: "UZ",
    ru: "RU",
    en: "EN",
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-card/98 backdrop-blur-xl shadow-lg border-b border-border/50"
          : "bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div
              className={cn(
                "flex items-center justify-center transition-all duration-300",
                "group-hover:scale-105",
              )}
            >
              <img 
                src="/white_logo.svg" 
                alt="SunAgro" 
                className="h-14 w-auto lg:h-16 object-contain transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 cursor-pointer">
                  {t.nav.allProducts}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {categories.slice(0, 8).map((cat: any) => (
                  <DropdownMenuItem key={cat.id} asChild className="cursor-pointer">
                    <Link href={`/shop?category=${cat.slug}`}>{cat.name?.[locale] || cat.name?.ru || cat.slug}</Link>
                </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/shop">{t.nav.allProducts}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about">
              <Button variant="ghost" className="cursor-pointer">{t.nav.about}</Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" className="cursor-pointer">{t.nav.blog}</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="cursor-pointer">{t.nav.contact}</Button>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Weather Widget */}
            <WeatherWidget />

            <div className="w-px h-6 bg-border/50" />

            <Button
              variant="outline"
              onClick={onOpenCalculator}
              className="flex items-center gap-2 bg-secondary/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <Calculator className="h-4 w-4" />
              {t.nav.calculator}
            </Button>
            <Link href="/contact" className="cursor-pointer">
              <Button className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <MessageCircle className="h-4 w-4" />
                {t.nav.consultation}
              </Button>
            </Link>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">{localeLabels[locale]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setLocale("uz")} className="cursor-pointer">
                  O&apos;zbekcha (UZ)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("ru")} className="cursor-pointer">
                  Русский (RU)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("en")} className="cursor-pointer">
                  English (EN)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Weather Widget - Hidden on very small screens to preserve hamburger menu */}
            <div className="hidden min-[460px]:block">
              <WeatherWidget />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  <Globe className="h-4 w-4" />
                  {localeLabels[locale]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale("uz")} className="cursor-pointer">UZ</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("ru")} className="cursor-pointer">RU</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("en")} className="cursor-pointer">EN</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t.nav.menu} className="cursor-pointer">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                {/* Accessibility: SheetTitle is required for screen readers */}
                <SheetHeader className="sr-only">
                  <SheetTitle>{t.nav.menu}</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2 mt-8">
                  {/* Weather Widget Section - Visible on small screens */}
                  <div className="mb-6 min-[460px]:hidden">
                    <div className="px-3 mb-3">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {locale === "uz" ? "Ob-havo" : locale === "ru" ? "Погода" : "Weather"}
                      </h3>
                      <div className="flex justify-center">
                        <WeatherWidget />
                      </div>
                    </div>
                    <div className="border-t border-border/50" />
                  </div>

                  {/* Product Categories Section */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                      {t.shop.title}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {categories.slice(0, 8).map((cat: any, idx: number) => (
                      <Link
                          key={cat.id}
                          href={`/shop?category=${cat.slug}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary/80 active:bg-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                          {(idx % 3 === 0 && <Home className="h-5 w-5 text-primary shrink-0" />) ||
                            (idx % 3 === 1 && <Leaf className="h-5 w-5 text-primary shrink-0" />) || (
                        <ShoppingBag className="h-5 w-5 text-primary shrink-0" />
                            )}
                          <span>{cat.name?.[locale] || cat.name?.ru || cat.slug}</span>
                      </Link>
                      ))}
                      <Link
                        href="/shop"
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ShoppingBag className="h-5 w-5 shrink-0" />
                        <span>{t.nav.allProducts}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border my-2" />

                  {/* Main Navigation Section */}
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/about"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary/80 active:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span>{t.nav.about}</span>
                    </Link>
                    <Link
                      href="/blog"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary/80 active:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span>{t.nav.blog}</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary/80 active:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span>{t.nav.contact}</span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border my-2" />

                  {/* Action Buttons Section */}
                  <div className="flex flex-col gap-3 mt-2 px-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        onOpenCalculator()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full justify-start gap-3 h-12 text-base font-medium"
                    >
                      <Calculator className="h-5 w-5" />
                      {t.nav.calculator}
                    </Button>
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="lg" className="w-full justify-start gap-3 h-12 text-base font-medium">
                        <MessageCircle className="h-5 w-5" />
                        {t.nav.consultation}
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
