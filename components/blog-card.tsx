"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import type { BlogPost } from "@/lib/blog"
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

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const { t, locale } = useI18n()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <article className="group bg-card rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative flex flex-col h-full">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-primary/30" />

      {/* Image or YouTube Video */}
      <Link href={`/blog/${post.slug}`} className="relative cursor-pointer">
        <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-gradient-to-br from-secondary to-secondary/50">
          {post.youtubeLink ? (
            <iframe
              src={convertToYouTubeEmbedUrl(post.youtubeLink)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={post.title[locale]}
            />
          ) : (
            <>
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title[locale]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}

          {/* Date badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-background/90 backdrop-blur-md rounded-full shadow-lg border border-border/50">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">{formatDate(post.date)}</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
        <Link href={`/blog/${post.slug}`} className="flex-1 cursor-pointer">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl text-foreground group-hover:text-primary transition-colors mb-2 sm:mb-3 line-clamp-2 leading-tight">
            {post.title[locale]}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 line-clamp-3 leading-relaxed">
          {post.excerpt[locale]}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-300 group/link mt-auto cursor-pointer"
        >
          <span>{t.blog.readMore}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
