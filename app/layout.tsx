import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/lib/i18n-context"
import { StructuredData } from "@/components/structured-data"
import { GeminiChat } from "@/components/gemini-chat"
import { YandexMetrica } from "@/components/yandex-metrica"
import { generateSEO, siteConfig } from "@/lib/seo"
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/structured-data"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  ...generateSEO({
    title: "Professional Agricultural Fiber",
    description: siteConfig.description.ru,
    keywords: [
      "теплица",
      "мульча",
      "укрывной материал",
      "защита растений",
      "сельское хозяйство Узбекистан",
      "агроматериалы Ташкент",
    ],
    locale: "ru",
  }),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [
      { url: '/icon-light.png', sizes: '180x180' },
    ],
    shortcut: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#2d5a27",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()

  return (
    <html lang="ru">
      <head>
        <StructuredData data={[organizationSchema, websiteSchema]} />
      </head>
      <body className={`font-sans antialiased`}>
        <I18nProvider>
          {children}
          <GeminiChat />
        </I18nProvider>
        <Analytics />
        {siteConfig.yandexMetrica.id && (
          <YandexMetrica ymId={siteConfig.yandexMetrica.id} />
        )}
      </body>
    </html>
  )
}
