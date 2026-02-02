import { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function getAllProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error)
    return []
  }
}

async function getAllBlogPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog?limit=1000&isPublished=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // Note: 404 page is included for completeness, but typically error pages are not in sitemaps
    // This is added per user request
    {
      url: `${baseUrl}/404`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.1,
    },
  ]

  // Fetch products and blog posts from API
  const [products, blogPosts] = await Promise.all([
    getAllProducts(),
    getAllBlogPosts(),
  ])

  // Product pages from API
  const productPages = products
    .filter((product: any) => product.isActive !== false)
    .map((product: any) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

  // Blog pages from API
  const blogPages = blogPosts
    .filter((post: any) => post.isPublished !== false)
    .map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

  return [...staticPages, ...productPages, ...blogPages]
}

