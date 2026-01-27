import { siteConfig } from "./seo"
import type { Product } from "./products"

export interface Organization {
  "@context": "https://schema.org"
  "@type": "Organization"
  name: string
  url: string
  logo: string
  contactPoint: {
    "@type": "ContactPoint"
    telephone: string
    contactType: string
    areaServed: string
    availableLanguage: string[]
  }
  sameAs: string[]
}

export interface WebSite {
  "@context": "https://schema.org"
  "@type": "WebSite"
  name: string
  url: string
  potentialAction: {
    "@type": "SearchAction"
    target: string
    "query-input": string
  }
}

export interface ProductSchema {
  "@context": "https://schema.org"
  "@type": "Product"
  name: string
  description: string
  image: string
  brand: {
    "@type": "Brand"
    name: string
  }
  offers: {
    "@type": "Offer"
    price: string
    priceCurrency: string
    availability: string
    url: string
  }
  aggregateRating?: {
    "@type": "AggregateRating"
    ratingValue: string
    reviewCount: string
  }
}

export interface BlogPosting {
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: {
    "@type": "Organization"
    name: string
  }
  publisher: {
    "@type": "Organization"
    name: string
    logo: {
      "@type": "ImageObject"
      url: string
    }
  }
  mainEntityOfPage: {
    "@type": "WebPage"
    "@id": string
  }
}

export interface BreadcrumbList {
  "@context": "https://schema.org"
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item?: string
  }>
}

export function generateOrganizationSchema(): Organization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      areaServed: "UZ",
      availableLanguage: ["Russian", "Uzbek", "English"],
    },
    sameAs: [
      `https://t.me/${siteConfig.links.telegram.replace("@", "")}`,
      `https://www.instagram.com/${siteConfig.links.instagram}`,
      `https://www.tiktok.com/${siteConfig.links.tiktok.replace("@", "")}`,
    ],
  }
}

export function generateWebSiteSchema(): WebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateProductSchema(
  product: Product | { 
    id?: string | number
    name: string | { uz: string; ru: string; en: string }
    slug: string
    price: number
    description?: { uz: string; ru: string; en: string } | string
    image?: string
    images?: {
      image1?: { url?: string; base64?: string }
    }
  }, 
  locale: "uz" | "ru" | "en" = "ru"
): ProductSchema {
  // Handle multilingual name
  const productName = typeof product.name === 'string' 
    ? product.name 
    : product.name[locale] || product.name.ru || product.name.uz || product.name.en

  // Handle multilingual description
  let description = ''
  if (product.description) {
    if (typeof product.description === 'string') {
      description = product.description
    } else if (product.description[locale]) {
      description = product.description[locale]
    } else if (product.description.ru) {
      description = product.description.ru
    } else if (product.description.uz) {
      description = product.description.uz
    } else if (product.description.en) {
      description = product.description.en
    }
  }
  
  // Fallback description if none provided
  if (!description) {
    description = productName
  }

  // Handle image - check both product.image and product.images
  let imageUrl = ''
  if (product.image) {
    imageUrl = product.image.startsWith('http') ? product.image : `${siteConfig.url}${product.image}`
  } else if ('images' in product && product.images?.image1?.url) {
    imageUrl = product.images.image1.url.startsWith('http') 
      ? product.images.image1.url 
      : `${siteConfig.url}${product.images.image1.url}`
  } else if ('images' in product && product.images?.image1?.base64) {
    imageUrl = product.images.image1.base64
  } else {
    imageUrl = `${siteConfig.url}/placeholder.svg`
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: description,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "UZS",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/shop/${product.slug}`,
    },
  }
}

export function generateBlogPostingSchema(
  title: string,
  description: string,
  image: string,
  datePublished: string,
  slug: string,
): BlogPosting {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: `${siteConfig.url}${image}`,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${siteConfig.url}${item.url}` }),
    })),
  }
}

