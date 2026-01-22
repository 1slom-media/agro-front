"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalculatorModal } from "@/components/calculator-modal"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, MessageCircle, Check, AlertCircle } from "lucide-react"
import { applicationsApi } from "@/lib/api-client"

export default function ContactPage() {
  const { t, locale } = useI18n()
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await applicationsApi.create({
        name,
        phone,
        message,
        type: "contact",
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setName("")
        setPhone("")
        setMessage("")
      }, 5000)
    } catch (err: any) {
      console.error("Failed to submit form:", err)
      setError(err.message || "Failed to submit form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenCalculator={() => setCalculatorOpen(true)} />

      <main className="flex-1 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.contact.title}</h1>
              <p className="text-lg text-muted-foreground">{t.contact.subtitle}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        {locale === "uz" && "Telefon"}
                        {locale === "ru" && "Телефон"}
                        {locale === "en" && "Phone"}
                      </h3>
                      <a href="tel:+998909665800" className="text-muted-foreground hover:text-primary transition-colors">+998 90 966 58 00</a>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:info@sunagro.uz" className="text-muted-foreground hover:text-primary transition-colors break-all">info@sunagro.uz</a>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        {locale === "uz" && "Manzil"}
                        {locale === "ru" && "Адрес"}
                        {locale === "en" && "Address"}
                      </h3>
                      <p className="text-muted-foreground">
                        {locale === "uz" && "Toshkent shahar, Chilonzor tumani"}
                        {locale === "ru" && "г. Ташкент, Чиланзарский район"}
                        {locale === "en" && "Tashkent city, Chilanzar district"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        {locale === "uz" && "Messenjerlar"}
                        {locale === "ru" && "Мессенджеры"}
                        {locale === "en" && "Messengers"}
                      </h3>
                      <a href="https://t.me/agrotola" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Telegram: @agrotola</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
                <h2 className="font-semibold text-xl mb-6">{t.contact.subtitle}</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-semibold text-lg">
                      {locale === "uz" && "Xabaringiz yuborildi!"}
                      {locale === "ru" && "Сообщение отправлено!"}
                      {locale === "en" && "Message sent!"}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      {locale === "uz" && "Tez orada siz bilan bog'lanamiz"}
                      {locale === "ru" && "Мы свяжемся с вами в ближайшее время"}
                      {locale === "en" && "We will contact you soon"}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">{t.contact.name}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.contact.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+998 90 966 58 00"
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t.contact.message}</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        disabled={loading}
                        className="resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? "Sending..." : t.contact.submit}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer onOpenCalculator={() => setCalculatorOpen(true)} />

      <CalculatorModal open={calculatorOpen} onOpenChange={setCalculatorOpen} />
    </div>
  )
}
