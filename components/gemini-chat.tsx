"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function GeminiChat() {
  const pathname = usePathname()
  const { locale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  // Don't show chat widget on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }
  
  const getWelcomeMessage = () => {
    if (locale === "uz") {
      return "Salom! Men SunAgro yordamchisiman. Agrovolokno, dehqonchilik va bog'dorchilik bo'yicha savollarga javob beraman, mahsulotlarimiz haqida batafsil ma'lumot beraman va kerak bo'lsa bog'lanish yo'llarini aytib o'taman."
    } else if (locale === "ru") {
      return "Здравствуйте! Я помощник SunAgro. Отвечаю на вопросы об агроволокне, сельском хозяйстве и садоводстве, расскажу о наших продуктах и при необходимости подскажу, как связаться."
    } else {
      return "Hello! I'm the SunAgro assistant. I can answer questions about agrofiber, farming, and gardening, explain our products in detail, and share contact options when needed."
    }
  }

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: getWelcomeMessage(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Update welcome message when locale changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([{
        role: "assistant",
        content: getWelcomeMessage(),
      }])
    }
  }, [locale])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      // Call Gemini API via backend
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          locale: locale,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If there's an error but we have a response field (fallback message), use it
        if (data.response) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
        } else {
          throw new Error(data.error || "Failed to get response")
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            locale === "uz"
              ? "Kechirasiz, xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."
              : locale === "ru"
              ? "Извините, произошла ошибка. Пожалуйста, попробуйте позже."
              : "Sorry, an error occurred. Please try again later.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out cursor-pointer relative",
            isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100 hover:scale-110"
          )}
          size="icon"
        >
          <MessageCircle className="h-6 w-6 relative z-10" />
          {/* Ripple wave effect */}
          {!isOpen && (
            <>
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
              <span className="absolute inset-0 rounded-full bg-primary/15 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
            </>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-card border rounded-lg shadow-2xl flex flex-col transition-all duration-200 ease-in-out",
          isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary/5">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">
              {locale === "uz" ? "SunAgro Yordamchisi" : locale === "ru" ? "Помощник SunAgro" : "SunAgro Assistant"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              locale === "uz"
                ? "Savolingizni yozing..."
                : locale === "ru"
                ? "Напишите ваш вопрос..."
                : "Write your question..."
            }
            disabled={loading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
