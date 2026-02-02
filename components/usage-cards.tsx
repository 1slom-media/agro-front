"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n-context"
import type { UsageType } from "@/lib/products"
import { Home, Sun, Sprout, Calculator, Grid3X3 } from "lucide-react"
import Link from "next/link"
import { categoriesApi } from "@/lib/api-client"

interface UsageCardsProps {
  onSelectUsage: (usage: UsageType, categoryId?: string) => void
}

export function UsageCards({ onSelectUsage }: UsageCardsProps) {
  const { t, locale } = useI18n()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await categoriesApi.getAll({ page: 1, limit: 20 })
        const active = (res.data || []).filter((c: any) => c.isActive)
        setCategories(active)
      } catch (e) {
        console.error("Failed to load categories:", e)
      }
    }
    load()
  }, [])

  interface UsageTypeItem {
    id: UsageType
    title: string
    description: string
    icon: typeof Home | typeof Sun | typeof Sprout
    image: string
    href: string
    color: string
  }

  const usageTypes: UsageTypeItem[] = categories.length > 0 ? categories.slice(0, 3).map((cat: any, idx: number) => {
    const Icon = idx === 0 ? Home : idx === 1 ? Sun : Sprout
    return {
      id: (cat.slug as UsageType) || ("open_field" as UsageType),
      title: cat.name?.[locale] || cat.name?.ru || cat.slug,
      description: cat.description?.[locale] || cat.description?.ru || "",
      icon: Icon,
      image: cat.image?.url || cat.image?.base64 || "/placeholder.svg",
      href: `/shop?category=${cat.slug}`,
      color: idx === 0 ? "from-emerald-500/20 to-green-500/20" : idx === 1 ? "from-amber-500/20 to-orange-500/20" : "from-slate-500/20 to-gray-500/20",
    }
  }) : []

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-28 bg-gradient-to-b from-secondary/50 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 text-foreground animate-fade-in-up">
          {t.usage.title}
        </h2>
        <p className="text-center text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-100 px-2">
          {t.hero.description}
        </p>

        {usageTypes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {usageTypes.map((usage: UsageTypeItem, index: number) => {
            const Icon = usage.icon
            return (
              <div
                key={usage.id}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-lg border border-border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
                  <img
                    src={usage.image || "/placeholder.svg"}
                    alt={usage.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${usage.color} to-card/90 via-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500`}
                  />

                  {/* Icon badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-background/80 backdrop-blur-sm rounded-full p-2.5 sm:p-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 relative">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {usage.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6">{usage.description}</p>

                  <div className="flex gap-2 sm:gap-3">
                    <Link href={usage.href} className="flex-1 cursor-pointer">
                      <button className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 text-foreground group-hover:shadow-md cursor-pointer">
                        {t.nav.allProducts}
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        const categoryId = categories.find((c: any) => c.slug === usage.id)?.id
                        onSelectUsage((usage.id as UsageType) || "open_field", categoryId)
                      }}
                      className="py-2.5 sm:py-3 px-3 sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:shadow-lg cursor-pointer"
                    >
                      <Calculator className="h-4 w-4" />
                      <span className="hidden xs:inline sm:inline">{t.nav.calculator}</span>
                    </button>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-primary/20" />
              </div>
            )
          })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
