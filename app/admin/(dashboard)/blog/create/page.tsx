"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function CreateBlogPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: { uz: "", ru: "", en: "" },
    content: { uz: "", ru: "", en: "" },
    excerpt: { uz: "", ru: "", en: "" },
    slug: "",
    featuredImageBase64: "",
    featuredImageUrl: "",
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
  }, [])

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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare payload matching backend DTO
      const payload: any = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        slug: formData.slug,
        isPublished: formData.isPublished,
      }

      if (formData.featuredImageBase64) {
        payload.featuredImageBase64 = formData.featuredImageBase64
      }
      if (formData.featuredImageUrl) {
        payload.featuredImageUrl = formData.featuredImageUrl
      }
      if (formData.publishedAt) {
        payload.publishedAt = new Date(formData.publishedAt)
      }
      if (formData.seo.metaTitle.uz || formData.seo.metaTitle.ru || formData.seo.metaTitle.en) {
        payload.seo = {
          metaTitle: formData.seo.metaTitle,
          metaDescription: formData.seo.metaDescription,
          keywords: formData.seo.keywords.filter(k => k.trim() !== ""),
        }
      }

      await blogApi.create(payload)
      toast({
        title: t.common.success,
        description: t.blog.created,
      })
      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Failed to create blog post:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.blog.createNew}</h1>
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
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData({
                        ...formData,
                        title: { ...formData.title, uz: value },
                        slug: formData.slug || generateSlug(value),
                      })
                    }}
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
                    value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().split("T")[0] : ""}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value ? new Date(e.target.value) : undefined })}
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
                <Label>{t.blog.featuredImage}</Label>
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
                    placeholder="SEO sarlavha (O'zbekcha) - qidiruv tizimlarida ko'rinadi"
                  />
                  <p className="text-xs text-muted-foreground">SEO uchun sarlavha (50-60 belgi tavsiya etiladi)</p>
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
                    placeholder="SEO заголовок (Русский) - отображается в поисковых системах"
                  />
                  <p className="text-xs text-muted-foreground">SEO заголовок (рекомендуется 50-60 символов)</p>
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
                    placeholder="SEO Title (English) - appears in search engines"
                  />
                  <p className="text-xs text-muted-foreground">SEO title (recommended 50-60 characters)</p>
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
                    placeholder="SEO tavsif (O'zbekcha) - qidiruv natijalarida ko'rinadi"
                  />
                  <p className="text-xs text-muted-foreground">Qisqa tavsif (150-160 belgi tavsiya etiladi)</p>
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
                    placeholder="SEO описание (Русский) - отображается в результатах поиска"
                  />
                  <p className="text-xs text-muted-foreground">Краткое описание (рекомендуется 150-160 символов)</p>
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
                    placeholder="SEO Description (English) - appears in search results"
                  />
                  <p className="text-xs text-muted-foreground">Short description (recommended 150-160 characters)</p>
                </div>
              </div>

                <div className="space-y-2">
                <Label htmlFor="keywords">{t.blog.keywords} (comma-separated)</Label>
                  <Input
                  id="keywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={formData.seo.keywords.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                        keywords: e.target.value.split(",").map(k => k.trim()).filter(k => k !== ""),
                        },
                      })
                    }
                  />
                <p className="text-xs text-muted-foreground">
                  Enter keywords separated by commas
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? t.common.loading : t.common.save}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">
              {t.common.cancel}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
