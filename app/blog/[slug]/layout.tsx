import type { Metadata } from "next"
import { generateSEO, siteConfig } from "@/lib/seo"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function getBlogPostBySlug(slug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/slug/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch blog post:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const post = await getBlogPostBySlug(slug)
    
    if (!post) {
      return {
        title: "Blog Post Not Found",
        description: "Blog post not found",
      }
    }

    // Get post title and description in Russian (default locale)
    const postTitle = typeof post.title === 'string' 
      ? post.title 
      : post.title?.ru || post.title?.uz || post.title?.en || "Blog Post"

    const postExcerpt = typeof post.excerpt === 'string'
      ? post.excerpt
      : post.excerpt?.ru || post.excerpt?.uz || post.excerpt?.en || postTitle

    // Use SEO metadata if available, otherwise use title/excerpt
    const seoTitle = post.seo?.metaTitle?.ru || postTitle
    const seoDescription = post.seo?.metaDescription?.ru || postExcerpt

    // Get post image
    let postImage = siteConfig.ogImage
    if (post.featuredImageUrl) {
      postImage = post.featuredImageUrl.startsWith('http') 
        ? post.featuredImageUrl 
        : `${siteConfig.url}${post.featuredImageUrl}`
    } else if (post.featuredImageBase64) {
      postImage = post.featuredImageBase64
    }

    // Generate keywords
    const keywords: string[] = []
    
    // Add SEO keywords if available
    if (post.seo?.keywords && Array.isArray(post.seo.keywords)) {
      keywords.push(...post.seo.keywords)
    }
    
    // Add default keywords
    keywords.push(
      "агроволокно",
      "агротекстиль",
      "спанбонд",
      "укрывной материал",
      "защита растений",
      "SunAgro",
      "sunagro.uz"
    )

    return {
      ...generateSEO({
        title: seoTitle,
        description: seoDescription,
        keywords,
        ogImage: postImage,
        ogType: "article",
        locale: "ru",
        canonical: `${siteConfig.url}/blog/${slug}`,
        publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      }),
    }
  } catch (error) {
    console.error("Failed to generate metadata for blog post:", error)
    return {
      title: "Blog Post",
      description: "Blog post page",
    }
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
