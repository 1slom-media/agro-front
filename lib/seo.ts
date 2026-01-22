import type { Metadata } from "next"

export const siteConfig = {
  name: "SunAgro",
  description: {
    uz: "SunAgro - O'zbekistondagi professional agrovolokno yetkazib beruvchi. Issiqxonalar, ochiq maydonlar va mulchlash uchun yuqori sifatli qoplama materiallar. Toshkentdan yetkazib berish.",
    ru: "SunAgro - профессиональный поставщик агроволокна в Узбекистане. Высококачественные укрывные материалы для теплиц, открытого грунта и мульчирования. Доставка из Ташкента.",
    en: "SunAgro - professional agrofiber supplier in Uzbekistan. High-quality cover materials for greenhouses, open fields, and mulching. Delivery from Tashkent.",
  },
  url: "https://sunagro.uz",
  ogImage: "/og-image.jpg",
  links: {
    telegram: "@agrotola",
    instagram: "agrovolokno.uz",
    tiktok: "@sunagro.uz",
  },
  contact: {
    phone: "+998909665800",
    email: "info@sunagro.uz",
    address: {
      uz: "Toshkent shahar, O'zbekiston",
      ru: "г. Ташкент, Узбекистан",
      en: "Tashkent city, Uzbekistan",
    },
  },
  yandexMetrica: {
    id: "106389176", 
  },
}

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: "website" | "article" | "product"
  locale?: "uz" | "ru" | "en"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  canonical?: string
  noindex?: boolean
}

export function generateSEO({
  title,
  description,
  keywords = [],
  ogImage = siteConfig.ogImage,
  ogType = "website",
  locale = "ru",
  publishedTime,
  modifiedTime,
  authors,
  canonical,
  noindex = false,
}: SEOProps): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`
  const url = canonical || siteConfig.url

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [
      "SunAgro",
      "sunagro.uz",
      "agrovolokno",
      "agrofiber",
      "агроволокно",
      "agricultural fabric",
      "greenhouse cover",
      "mulch",
      "frost protection",
      "Uzbekistan",
      "Tashkent",
      "dehqonchilik",
      "bog'dorchilik",
      "сельское хозяйство",
      "садоводство",
      "агроматериалы",
      "укрывной материал",
      "теплица",
      "мульчирование",
      ...keywords,
    ].join(", "),
    authors: authors ? authors.map((name) => ({ name })) : [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        uz: `${siteConfig.url}/uz`,
        ru: `${siteConfig.url}/ru`,
        en: `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "uz" ? "uz_UZ" : locale === "ru" ? "ru_RU" : "en_US",
      type: ogType,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: siteConfig.links.telegram,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "cU6tikbNhnhP92IpPyHLxv5C-pbivl0BX4I9gfcNq58",
      yandex: "497756f2706d3b49",
    },
  }

  return metadata
}

