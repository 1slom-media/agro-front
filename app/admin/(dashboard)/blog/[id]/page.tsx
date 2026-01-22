"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, X } from "lucide-react"
import { blogApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: { uz: "", ru: "", en: "" },
    content: { uz: "", ru: "", en: "" },
    excerpt: { uz: "", ru: "", en: "" },
    slug: "",
    featuredImageUrl: "",
    featuredImageBase64: "",
    isPublished: false,
    publishedAt: undefined as Date | undefined,
    seo: {
      metaTitle: { uz: "", ru: "", en: "" },
      metaDescription: { uz: "", ru: "", en: "" },
      keywords: [] as string[],
    },
  })

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    loadPost()
  }, [])

  const loadPost = async () => {
    try {
      const post = await blogApi.getOne(params.id as string)
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || { uz: "", ru: "", en: "" },
        slug: post.slug,
        featuredImageUrl: post.featuredImageUrl || "",
        featuredImageBase64: post.featuredImageBase64 || "",
        isPublished: post.isPublished,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        seo: post.seo || {
          metaTitle: { uz: "", ru: "", en: "" },
          metaDescription: { uz: "", ru: "", en: "" },
          keywords: { uz: "", ru: "", en: "" },
        },
      })
    } catch (error: any) {
      console.error("Failed to load blog post:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setFormData({ ...formData, featuredImageBase64: base64, featuredImageUrl: "" })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData({ ...formData, featuredImageBase64: "", featuredImageUrl: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await blogApi.update(params.id as string, formData)
      toast({
        title: t.common.success,
        description: t.blog.updated,
      })
      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Failed to update blog post:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">{t.common.loading}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.blog.editPost}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.blog.basicInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="title-uz">{t.blog.titleUz}</Label>
                  <Input
                    id="title-uz"
                    value={formData.title.uz}
                    onChange={(e) =>
                      setFormData({ ...formData, title: { ...formData.title, uz: e.target.value } })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title-ru">{t.blog.titleRu}</Label>
                  <Input
                    id="title-ru"
                    value={formData.title.ru}
                    onChange={(e) =>
                      setFormData({ ...formData, title: { ...formData.title, ru: e.target.value } })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title-en">{t.blog.titleEn}</Label>
                  <Input
                    id="title-en"
                    value={formData.title.en}
                    onChange={(e) =>
                      setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="excerpt-uz">{t.blog.excerptUz}</Label>
                  <Textarea
                    id="excerpt-uz"
                    value={formData.excerpt.uz}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        excerpt: { ...formData.excerpt, uz: e.target.value },
                      })
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt-ru">{t.blog.excerptRu}</Label>
                  <Textarea
                    id="excerpt-ru"
                    value={formData.excerpt.ru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        excerpt: { ...formData.excerpt, ru: e.target.value },
                      })
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt-en">{t.blog.excerptEn}</Label>
                  <Textarea
                    id="excerpt-en"
                    value={formData.excerpt.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        excerpt: { ...formData.excerpt, en: e.target.value },
                      })
                    }
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="content-uz">{t.blog.contentUz}</Label>
                  <Textarea
                    id="content-uz"
                    value={formData.content.uz}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, uz: e.target.value },
                      })
                    }
                    rows={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-ru">{t.blog.contentRu}</Label>
                  <Textarea
                    id="content-ru"
                    value={formData.content.ru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, ru: e.target.value },
                      })
                    }
                    rows={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-en">{t.blog.contentEn}</Label>
                  <Textarea
                    id="content-en"
                    value={formData.content.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, en: e.target.value },
                      })
                    }
                    rows={6}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="slug">{t.blog.slug}</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishDate">{t.blog.publishDate}</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isPublished">{t.blog.isPublished}</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPublished: checked })
                      }
                    />
                    <Label htmlFor="isPublished" className="cursor-pointer">
                      {formData.isPublished ? t.blog.published : t.blog.draft}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>{t.blog.image}</Label>
                {formData.featuredImageBase64 || formData.featuredImageUrl ? (
                  <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={formData.featuredImageBase64 || formData.featuredImageUrl}
                      alt="Blog image"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      className="hidden"
                      id="upload-image"
                    />
                    <Label
                      htmlFor="upload-image"
                      className="flex flex-col items-center justify-center w-full max-w-md h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                    >
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t.blog.uploadImage}</span>
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.blog.seoSettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="meta-title-uz">{t.blog.metaTitleUz}</Label>
                  <Input
                    id="meta-title-uz"
                    value={formData.seo.metaTitle.uz}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          metaTitle: { ...formData.seo.metaTitle, uz: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-title-ru">{t.blog.metaTitleRu}</Label>
                  <Input
                    id="meta-title-ru"
                    value={formData.seo.metaTitle.ru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          metaTitle: { ...formData.seo.metaTitle, ru: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-title-en">{t.blog.metaTitleEn}</Label>
                  <Input
                    id="meta-title-en"
                    value={formData.seo.metaTitle.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          metaTitle: { ...formData.seo.metaTitle, en: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="meta-desc-uz">{t.blog.metaDescriptionUz}</Label>
                  <Textarea
                    id="meta-desc-uz"
                    value={formData.seo.metaDescription.uz}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          metaDescription: { ...formData.seo.metaDescription, uz: e.target.value },
                        },
                      })
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-desc-ru">{t.blog.metaDescriptionRu}</Label>
                  <Textarea
                    id="meta-desc-ru"
                    value={formData.seo.metaDescription.ru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          metaDescription: { ...formData.seo.metaDescription, ru: e.target.value },
                        },
                      })
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-desc-en">{t.blog.metaDescriptionEn}</Label>
                  <Textarea
                    id="meta-desc-en"
                    value={formData.seo.metaDescription.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          metaDescription: { ...formData.seo.metaDescription, en: e.target.value },
                        },
                      })
                    }
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="keywords-uz">{t.blog.keywordsUz}</Label>
                  <Input
                    id="keywords-uz"
                    value={formData.seo.keywords.uz}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          keywords: { ...formData.seo.keywords, uz: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords-ru">{t.blog.keywordsRu}</Label>
                  <Input
                    id="keywords-ru"
                    value={formData.seo.keywords.ru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          keywords: { ...formData.seo.keywords, ru: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords-en">{t.blog.keywordsEn}</Label>
                  <Input
                    id="keywords-en"
                    value={formData.seo.keywords.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          keywords: { ...formData.seo.keywords, en: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? t.common.loading : t.common.save}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t.common.cancel}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
