"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalculatorModal } from "@/components/calculator-modal"
import { useI18n } from "@/lib/i18n-context"
import { blogApi } from "@/lib/api-client"
import { ArrowRight, Calendar } from "lucide-react"
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

interface ApiBlogPost {
  id: string
  title: { uz: string; ru: string; en: string }
  slug: string
  excerpt?: { uz: string; ru: string; en: string }
  featuredImageBase64?: string
  featuredImageUrl?: string
  youtubeLink?: string
  publishedAt?: string
  isPublished: boolean
}

export default function BlogPage() {
  const { t, locale } = useI18n()
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const response = await blogApi.getAll({ page: 1, limit: 100 })
      const publishedPosts = (response.data || []).filter((p: ApiBlogPost) => p.isPublished)
      setPosts(publishedPosts.map((p: ApiBlogPost) => ({
        id: p.id,
        slug: p.slug,
        image: p.featuredImageBase64 || p.featuredImageUrl || "/placeholder.svg",
        youtubeLink: p.youtubeLink,
        title: p.title,
        excerpt: p.excerpt || { uz: "", ru: "", en: "" },
        date: p.publishedAt || new Date().toISOString(),
      })))
    } catch (error) {
      console.error("Failed to load blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenCalculator={() => setCalculatorOpen(true)} />

      <main className="flex-1 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-8">{t.blog.title}</h1>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t.common.loading || "Loading..."}</p>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post) => (
              <article
                key={post.id}
                className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                  <Link href={`/blog/${post.slug}`} className="cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    {post.youtubeLink ? (
                      <iframe
                        src={convertToYouTubeEmbedUrl(post.youtubeLink)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={post.title[locale]}
                      />
                    ) : (
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title[locale]}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(
                        locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </time>
                  </div>
                    <Link href={`/blog/${post.slug}`} className="cursor-pointer">
                    <h2 className="font-semibold text-lg text-foreground hover:text-primary transition-colors mb-2">
                      {post.title[locale]}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-4">{post.excerpt[locale]}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline cursor-pointer"
                  >
                    {t.blog.readMore}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </main>

      <Footer onOpenCalculator={() => setCalculatorOpen(true)} />

      <CalculatorModal open={calculatorOpen} onOpenChange={setCalculatorOpen} />
    </div>
  )
}
