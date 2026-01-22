"use client"

import { useI18n } from "@/lib/i18n-context"
import { Shield, Leaf, Award, TrendingUp } from "lucide-react"

export function FeaturesSection() {
  const { locale } = useI18n()

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="bg-card rounded-xl p-4 sm:p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                {locale === "uz" ? "Himoya" : locale === "ru" ? "Защита" : "Protection"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {locale === "uz" ? "-15°C gacha" : locale === "ru" ? "До -15°C" : "Up to -15°C"}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 sm:p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                {locale === "uz" ? "Ekologik" : locale === "ru" ? "Экологично" : "Eco-friendly"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {locale === "uz" ? "100% xavfsiz" : locale === "ru" ? "100% безопасно" : "100% safe"}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 sm:p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                {locale === "uz" ? "Sifat" : locale === "ru" ? "Качество" : "Quality"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {locale === "uz" ? "3-5 yil" : locale === "ru" ? "3-5 лет" : "3-5 years"}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 sm:p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                {locale === "uz" ? "Hosildorlik" : locale === "ru" ? "Урожайность" : "Yield"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {locale === "uz" ? "+30% ko'proq" : locale === "ru" ? "+30% больше" : "+30% more"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


