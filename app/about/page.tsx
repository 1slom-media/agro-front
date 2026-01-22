"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalculatorModal } from "@/components/calculator-modal"
import { useI18n } from "@/lib/i18n-context"
import { Leaf, Shield, Truck, Award } from "lucide-react"

export default function AboutPage() {
  const { locale } = useI18n()
  const [calculatorOpen, setCalculatorOpen] = useState(false)

  const content = {
    uz: {
      title: "Biz haqimizda",
      subtitle: "Professional agrovolokno yetkazib beruvchi",
      description:
        "Biz 10 yildan ortiq vaqt davomida O'zbekiston fermerlariga yuqori sifatli agrovolokno yetkazib kelamiz. Bizning missiyamiz - hosilingizni himoya qilish va hosildorlikni oshirish.",
      features: [
        {
          icon: Leaf,
          title: "Ekologik toza",
          description: "Barcha mahsulotlarimiz atrof-muhitga zarar keltirmaydi",
        },
        {
          icon: Shield,
          title: "Sifat kafolati",
          description: "Har bir mahsulot sifat nazoratidan o'tgan",
        },
        {
          icon: Truck,
          title: "Tez yetkazib berish",
          description: "Toshkent bo'ylab bepul yetkazib berish",
        },
        {
          icon: Award,
          title: "Professional maslahat",
          description: "Mutaxassislarimiz sizga to'g'ri tanlov qilishda yordam beradi",
        },
      ],
      stats: [
        { number: "10+", label: "Yillik tajriba" },
        { number: "5000+", label: "Mamnun mijozlar" },
        { number: "100+", label: "Mahsulot turlari" },
        { number: "24/7", label: "Qo'llab-quvvatlash" },
      ],
    },
    ru: {
      title: "О нас",
      subtitle: "Профессиональный поставщик агроволокна",
      description:
        "Более 10 лет мы поставляем высококачественное агроволокно фермерам Узбекистана. Наша миссия - защитить ваш урожай и повысить урожайность.",
      features: [
        {
          icon: Leaf,
          title: "Экологически чистый",
          description: "Все наши продукты безопасны для окружающей среды",
        },
        {
          icon: Shield,
          title: "Гарантия качества",
          description: "Каждый продукт проходит контроль качества",
        },
        {
          icon: Truck,
          title: "Быстрая доставка",
          description: "Бесплатная доставка по Ташкенту",
        },
        {
          icon: Award,
          title: "Профессиональная консультация",
          description: "Наши специалисты помогут вам сделать правильный выбор",
        },
      ],
      stats: [
        { number: "10+", label: "Лет опыта" },
        { number: "5000+", label: "Довольных клиентов" },
        { number: "100+", label: "Видов продукции" },
        { number: "24/7", label: "Поддержка" },
      ],
    },
    en: {
      title: "About Us",
      subtitle: "Professional agrofiber supplier",
      description:
        "For over 10 years, we have been supplying high-quality agrofiber to farmers in Uzbekistan. Our mission is to protect your harvest and increase yields.",
      features: [
        {
          icon: Leaf,
          title: "Eco-friendly",
          description: "All our products are environmentally safe",
        },
        {
          icon: Shield,
          title: "Quality guarantee",
          description: "Every product passes quality control",
        },
        {
          icon: Truck,
          title: "Fast delivery",
          description: "Free delivery in Tashkent",
        },
        {
          icon: Award,
          title: "Professional advice",
          description: "Our specialists will help you make the right choice",
        },
      ],
      stats: [
        { number: "10+", label: "Years of experience" },
        { number: "5000+", label: "Satisfied customers" },
        { number: "100+", label: "Product types" },
        { number: "24/7", label: "Support" },
      ],
    },
  }

  const c = content[locale]

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenCalculator={() => setCalculatorOpen(true)} />

      <main className="flex-1 pt-20 lg:pt-24">
        {/* Hero */}
        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">{c.title}</h1>
                <p className="text-xl text-primary font-medium mb-4">{c.subtitle}</p>
                <p className="text-muted-foreground text-lg leading-relaxed">{c.description}</p>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/agricultural-field-with-white-agrofiber-cover-gree.jpg"
                  alt="About us"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {c.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</p>
                  <p className="text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {c.features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="bg-card rounded-xl border border-border p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenCalculator={() => setCalculatorOpen(true)} />

      <CalculatorModal open={calculatorOpen} onOpenChange={setCalculatorOpen} />
    </div>
  )
}
