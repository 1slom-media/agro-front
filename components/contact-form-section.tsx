"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, Phone, Mail, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { applicationsApi } from "@/lib/api-client"

export function ContactFormSection() {
  const { t } = useI18n()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await applicationsApi.create({
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        type: "contact",
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: "", phone: "", message: "" })
      }, 5000)
    } catch (err: any) {
      console.error("Failed to submit form:", err)
      setError(err.message || "Failed to submit form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-28 bg-gradient-to-br from-primary/5 via-background to-secondary/20 relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-tr from-primary/15 to-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left side - Contact info */}
          <div className="animate-fade-in-up order-2 lg:order-1">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
              {t.contact.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">{t.contact.subtitle}</p>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4 group">
                <div className="bg-primary/10 rounded-full p-2.5 sm:p-3 transition-transform duration-300 group-hover:scale-110">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Telefon / Телефон</p>
                  <a
                    href="tel:+998909665800"
                    className="text-base sm:text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    +998 90 966 58 00
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 group">
                <div className="bg-primary/10 rounded-full p-2.5 sm:p-3 transition-transform duration-300 group-hover:scale-110">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Email</p>
                  <a
                    href="mailto:info@sunagro.uz"
                    className="text-base sm:text-lg font-medium text-foreground hover:text-primary transition-colors break-all"
                  >
                    info@sunagro.uz
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 group">
                <div className="bg-primary/10 rounded-full p-2.5 sm:p-3 transition-transform duration-300 group-hover:scale-110">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Telegram</p>
                  <a
                    href="https://t.me/agrotola"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    @agrotola
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8 border-2 border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in-up animation-delay-200 order-1 lg:order-2 relative overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full" />

            <div className="relative z-10">
              {submitted ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-full p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4 animate-bounce">
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Xabar yuborildi!</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Сообщение отправлено! / Message sent!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="contact-name" className="text-sm font-semibold text-foreground">
                        {t.contact.name}
                      </Label>
                      <Input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        disabled={loading}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary h-11 sm:h-12 bg-background/50 backdrop-blur-sm"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="contact-phone" className="text-sm font-semibold text-foreground">
                        {t.contact.phone}
                      </Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+998 90 966 58 00"
                        required
                        disabled={loading}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary h-11 sm:h-12 bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="contact-message" className="text-sm font-semibold text-foreground">
                      {t.contact.message}
                    </Label>
                    <Textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="..."
                      rows={5}
                      disabled={loading}
                      className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background/50 backdrop-blur-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-12 sm:h-13 text-base font-semibold cursor-pointer"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {loading ? "Sending..." : t.contact.submit}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
