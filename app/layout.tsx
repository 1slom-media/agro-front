import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { I18nProvider } from "@/lib/i18n-context"
import { StructuredData } from "@/components/structured-data"
import { GeminiChatLazy } from "@/components/gemini-chat-lazy"
import { AnalyticsScripts } from "@/components/analytics-scripts"
import { generateSEO, siteConfig } from "@/lib/seo"
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/structured-data"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
})

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
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <StructuredData data={[organizationSchema, websiteSchema]} />
        <link
          rel="preload"
          as="image"
          href="/agricultural-field-with-white-agrofiber-cover-gree.jpg"
          fetchPriority="high"
        />
        {/* Preconnect to API server to speed up data fetching */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'} />
        {process.env.NEXT_PUBLIC_SITE_URL?.includes("sunagro.uz") && (
          <link rel="preconnect" href="https://minio.sunagro.uz" crossOrigin="anonymous" />
        )}
      </head>
      <body className={`font-sans antialiased`}>
        <I18nProvider>
          {children}
          <GeminiChatLazy />
        </I18nProvider>
        <AnalyticsScripts />
      </body>
    </html>
  )
}
