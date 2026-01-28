"use client"

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalculatorModal } from "@/components/calculator-modal"
import { StructuredData } from "@/components/structured-data"
import { useI18n } from "@/lib/i18n-context"
import { blogApi } from "@/lib/api-client"
import { generateBlogPostingSchema, generateBreadcrumbSchema } from "@/lib/structured-data"
import { ArrowLeft, Calendar } from "lucide-react"
// YouTube URL conversion utility
function convertToYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Remove any whitespace
  url = url.trim();
  
  // Extract video ID from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  // If already in embed format, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  return url;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t, locale } = useI18n()
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      const data = await blogApi.getBySlug(slug as string)
      setPost(data)
    } catch (error) {
      console.error("Failed to load blog post:", error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">{t.common.loading}</span>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  // Generate structured data for SEO
  const blogSchema = generateBlogPostingSchema(
    post.title[locale],
    post.excerpt?.[locale] || "",
    post.featuredImageUrl || post.featuredImageBase64 || "/placeholder.svg",
    post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
    post.slug,
  )
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t.blog.title, url: "/blog" },
    { name: post.title[locale] },
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData data={[blogSchema, breadcrumbSchema]} />
      <Header onOpenCalculator={() => setCalculatorOpen(true)} />

      <main className="flex-1 pt-20 lg:pt-24">
        <article className="container mx-auto px-4 py-8 lg:py-12">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.blog.title}
          </Link>

          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              {post.publishedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(
                      locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </time>
                </div>
              )}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                {post.title[locale]}
              </h1>
              {post.excerpt?.[locale] && (
                <p className="text-lg text-muted-foreground">{post.excerpt[locale]}</p>
              )}
            </header>

            {/* Featured Image or YouTube Video */}
            {post.youtubeLink ? (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <iframe
                  src={convertToYouTubeEmbedUrl(post.youtubeLink)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={post.title[locale]}
                />
              </div>
            ) : (post.featuredImageUrl || post.featuredImageBase64) && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <Image 
                  src={post.featuredImageUrl || post.featuredImageBase64 || "/placeholder.svg"} 
                  alt={post.title[locale]} 
                  fill 
                  className="object-cover" 
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {post.content[locale]}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer onOpenCalculator={() => setCalculatorOpen(true)} />

      <CalculatorModal open={calculatorOpen} onOpenChange={setCalculatorOpen} />
    </div>
  )
}
