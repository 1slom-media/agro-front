"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Layers, Ruler, Thermometer, ChevronRight } from "lucide-react"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"

const DICTIONARY_TYPES = [
  { 
    value: 'color', 
    label: { uz: 'Rang', ru: 'Цвет' },
    icon: Palette,
    description: { uz: 'Ranglar ro\'yxati', ru: 'Список цветов' },
    href: '/admin/dictionary/color'
  },
  { 
    value: 'density', 
    label: { uz: 'Zichlik', ru: 'Плотность' },
    icon: Layers,
    description: { uz: 'Zichlik qiymatlari (г/м²)', ru: 'Значения плотности (г/м²)' },
    href: '/admin/dictionary/density'
  },
  { 
    value: 'size', 
    label: { uz: 'O\'lcham', ru: 'Размер' },
    icon: Ruler,
    description: { uz: 'Boyi va eni (1,3х200)', ru: 'Ширина и длина (1,3х200)' },
    href: '/admin/dictionary/size'
  },
  { 
    value: 'temperature', 
    label: { uz: 'Harorat', ru: 'Температура' },
    icon: Thermometer,
    description: { uz: 'Himoya harorati', ru: 'Температура защиты' },
    href: '/admin/dictionary/temperature'
  },
]

export default function DictionaryPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    const handleLocaleChange = (e: CustomEvent) => {
      setLocale(e.detail)
    }
    window.addEventListener("adminLocaleChange" as any, handleLocaleChange)
    return () => {
      window.removeEventListener("adminLocaleChange" as any, handleLocaleChange)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t.dictionary.title}</h1>
        <p className="text-muted-foreground mt-2">
          {locale === 'uz' 
            ? 'Har bir tur uchun alohida bo\'lim' 
            : 'Отдельный раздел для каждого типа'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {DICTIONARY_TYPES.map((type) => {
          const Icon = type.icon
          return (
            <Link key={type.value} href={type.href} className="cursor-pointer">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {type.label[locale]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description[locale]}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
