export interface BlogPost {
  id: number
  slug: string
  image: string
  youtubeLink?: string
  title: {
    uz: string
    ru: string
    en: string
  }
  excerpt: {
    uz: string
    ru: string
    en: string
  }
  content: {
    uz: string
    ru: string
    en: string
  }
  date: string
}

export const blogPosts: BlogPost[] = []
