import type { Metadata } from "next"
import { generateSEO, siteConfig } from "@/lib/seo"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function getProductBySlug(slug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const product = await getProductBySlug(slug)
    
    if (!product) {
      return {
        title: "Product Not Found",
        description: "Product not found",
      }
    }

    // Get product name and description in Russian (default locale)
    const productName = typeof product.name === 'string' 
      ? product.name 
      : product.name.ru || product.name.uz || product.name.en

    const productDescription = typeof product.description === 'string'
      ? product.description
      : product.description?.ru || product.description?.uz || product.description?.en || productName

    // Build SEO-optimized title (50-60 characters)
    const density = product.specifications?.density ? `${product.specifications.density} г/м²` : ''
    const color = product.specifications?.color === 'white' ? 'белое' : product.specifications?.color === 'black' ? 'черное' : ''
    const usage = product.specifications?.usage?.includes('greenhouse') ? 'для теплиц' 
      : product.specifications?.usage?.includes('mulch') ? 'для мульчирования'
      : product.specifications?.usage?.includes('open_field') ? 'для открытого грунта' : ''
    
    // SEO Title: "Агроволокно 30 г/м² белое для теплиц купить в Ташкенте | SunAgro"
    const seoTitle = [
      color && `${color} агроволокно`,
      density && density,
      usage && usage,
      'купить в Ташкенте',
      '| SunAgro'
    ].filter(Boolean).join(' ').slice(0, 60) || productName

    // SEO Description (150-160 characters)
    const price = product.price ? new Intl.NumberFormat('ru-RU').format(product.price) : ''
    const seoDescription = [
      `${color ? color.charAt(0).toUpperCase() + color.slice(1) : 'Агроволокно'} агроволокно`,
      density && `плотностью ${density}`,
      usage && usage,
      product.specifications?.temperature && `защита до ${product.specifications.temperature}`,
      price && `от ${price} сум`,
      'Доставка по Узбекистану. Оптовые цены.'
    ].filter(Boolean).join('. ').slice(0, 160) || productDescription

    // Get product image
    let productImage = siteConfig.ogImage
    if (product.image) {
      productImage = product.image.startsWith('http') 
        ? product.image 
        : `${siteConfig.url}${product.image}`
    } else if (product.images?.image1?.url) {
      productImage = product.images.image1.url.startsWith('http')
        ? product.images.image1.url
        : `${siteConfig.url}${product.images.image1.url}`
    } else if (product.images?.image1?.base64) {
      productImage = product.images.image1.base64
    }

    // Generate keywords based on product specifications
    const keywords: string[] = [
      productName,
      "агроволокно",
      "агротекстиль",
      "спанбонд",
    ]

    if (product.specifications?.color) {
      keywords.push(product.specifications.color === "white" ? "белое агроволокно" : "черное агроволокно")
    }

    if (product.specifications?.density) {
      keywords.push(`агроволокно ${product.specifications.density} г/м²`)
    }

    if (product.specifications?.usage?.includes("greenhouse")) {
      keywords.push("агроволокно для теплиц", "укрывной материал для теплиц")
    }

    if (product.specifications?.usage?.includes("open_field")) {
      keywords.push("агроволокно для открытого грунта", "защита растений")
    }

    if (product.specifications?.usage?.includes("mulch")) {
      keywords.push("мульча", "мульчирующий материал", "защита от сорняков")
    }

    return {
      ...generateSEO({
        title: seoTitle,
        description: seoDescription,
        keywords,
        ogImage: productImage,
        ogType: "website",
        locale: "ru",
        canonical: `${siteConfig.url}/shop/${slug}`,
      }),
    }
  } catch (error) {
    console.error("Failed to generate metadata for product:", error)
    return {
      title: "Product",
      description: "Product page",
    }
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
