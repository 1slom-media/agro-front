"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, X } from "lucide-react"
import { categoriesApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

export default function CreateCategoryPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: { uz: "", ru: "", en: "" },
    description: { uz: "", ru: "", en: "" },
    slug: "",
    image: { url: "", base64: "" },
    isActive: true,
    order: 0,
  })

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await categoriesApi.create(formData)
      toast({
        title: t.common.success,
        description: t.categories.created,
      })
      router.push("/admin/categories")
    } catch (error: any) {
      console.error("Failed to create category:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setFormData({ ...formData, image: { url: "", base64 } })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData({ ...formData, image: { url: "", base64: "" } })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.categories.createNew}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t.categories.createNew}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name-uz">{t.categories.nameUz}</Label>
                <Input
                  id="name-uz"
                  value={formData.name.uz}
                  onChange={(e) => {
                    const value = e.target.value
                    setFormData({
                      ...formData,
                      name: { ...formData.name, uz: value },
                      slug: formData.slug || generateSlug(value),
                    })
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name-ru">{t.categories.nameRu}</Label>
                <Input
                  id="name-ru"
                  value={formData.name.ru}
                  onChange={(e) =>
                    setFormData({ ...formData, name: { ...formData.name, ru: e.target.value } })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name-en">{t.categories.nameEn}</Label>
                <Input
                  id="name-en"
                  value={formData.name.en}
                  onChange={(e) =>
                    setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>{t.categories.image || "Image"}</Label>
              {formData.image.base64 || formData.image.url ? (
                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image.base64 || formData.image.url}
                    alt="Category"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative max-w-md">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    className="hidden"
                    id="upload-category-image"
                  />
                  <Label
                    htmlFor="upload-category-image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                  >
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t.categories.uploadImage || t.products.uploadImage}</span>
                  </Label>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="desc-uz">{t.categories.descriptionUz}</Label>
                <Textarea
                  id="desc-uz"
                  value={formData.description.uz}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, uz: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc-ru">{t.categories.descriptionRu}</Label>
                <Textarea
                  id="desc-ru"
                  value={formData.description.ru}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, ru: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc-en">{t.categories.descriptionEn}</Label>
                <Textarea
                  id="desc-en"
                  value={formData.description.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, en: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="slug">{t.categories.slug}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">{t.categories.order}</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order || ""}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value ? parseInt(e.target.value) || 0 : 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">{t.categories.isActive}</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {formData.isActive ? t.common.active : t.common.inactive}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="cursor-pointer">
                {loading ? t.common.loading : t.common.save}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">
                {t.common.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

