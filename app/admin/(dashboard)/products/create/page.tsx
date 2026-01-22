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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import { dictionaryApi, productsApi, categoriesApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

export default function CreateProductPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [dict, setDict] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: { uz: "", ru: "", en: "" },
    description: { uz: "", ru: "", en: "" },
    slug: "",
    categoryId: "",
    price: "",
    isActive: true,
    specifications: {
      temperature: "",
      density: "",
      color: "",
      size: "",
      sellType: "",
    },
    images: {
      image1: { url: "", base64: "" },
      image2: { url: "", base64: "" },
      image3: { url: "", base64: "" },
    },
  })

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    loadCategories()
    loadDictionary()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll({ page: 1, limit: 100 })
      setCategories(response.data || [])
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const loadDictionary = async () => {
    try {
      const res = await dictionaryApi.getFilters()
      setDict(res)
    } catch (e) {
      console.error("Failed to load dictionary:", e)
    }
  }

  const handleImageUpload = async (imageKey: "image1" | "image2" | "image3", file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setFormData({
        ...formData,
        images: {
          ...formData.images,
          [imageKey]: { url: "", base64 },
        },
      })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (imageKey: "image1" | "image2" | "image3") => {
    setFormData({
      ...formData,
      images: {
        ...formData.images,
        [imageKey]: { url: "", base64: "" },
      },
    })
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
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
      }
      await productsApi.create(payload)
      toast({
        title: t.common.success,
        description: t.products.created,
      })
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Failed to create product:", error)
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
          <h1 className="text-3xl font-bold tracking-tight">{t.products.createNew}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t.products.createNew}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name-uz">{t.products.nameUz}</Label>
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
                <Label htmlFor="name-ru">{t.products.nameRu}</Label>
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
                <Label htmlFor="name-en">{t.products.nameEn}</Label>
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

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="desc-uz">{t.products.descriptionUz}</Label>
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
                <Label htmlFor="desc-ru">{t.products.descriptionRu}</Label>
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
                <Label htmlFor="desc-en">{t.products.descriptionEn}</Label>
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
                <Label htmlFor="slug">{t.products.slug}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="product-slug"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t.products.category}</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.products.selectCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name[locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t.products.price}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>{t.products.specifications}</Label>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <Label>{locale === 'uz' ? 'Rang' : 'Цвет'}</Label>
                  <Select
                    value={formData.specifications.color || "all"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, color: value === "all" ? "" : value },
                      })
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder={t.common.select || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.common.all || "All"}</SelectItem>
                      {(dict?.color || []).map((opt: any) => (
                        <SelectItem key={opt.id || opt.value} value={opt.value}>
                          {opt.label?.[locale] || opt.label?.ru || opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{locale === 'uz' ? 'Zichlik' : 'Плотность'}</Label>
                  <Select
                    value={formData.specifications.density || "all"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, density: value === "all" ? "" : value },
                      })
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder={t.common.select || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.common.all || "All"}</SelectItem>
                      {(dict?.density || []).map((opt: any) => (
                        <SelectItem key={opt.id || opt.value} value={opt.value}>
                          {opt.label?.[locale] || opt.label?.ru || opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{locale === 'uz' ? 'O\'lcham' : 'Размер'}</Label>
                  <Select
                    value={formData.specifications.size || "all"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, size: value === "all" ? "" : value },
                      })
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder={t.common.select || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.common.all || "All"}</SelectItem>
                      {(dict?.size || []).map((opt: any) => (
                        <SelectItem key={opt.id || opt.value} value={opt.value}>
                          {opt.label?.[locale] || opt.label?.ru || opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{locale === 'uz' ? 'Sotish turi' : 'Тип продажи'}</Label>
                  <Select
                    value={formData.specifications.sellType || "all"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, sellType: value === "all" ? "" : value },
                      })
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder={t.common.select || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.common.all || "All"}</SelectItem>
                      {(dict?.selltype || []).map((opt: any) => (
                        <SelectItem key={opt.id || opt.value} value={opt.value}>
                          {opt.label?.[locale] || opt.label?.ru || opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{locale === 'uz' ? 'Harorat' : 'Температура'}</Label>
                  <Select
                    value={formData.specifications.temperature || "all"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, temperature: value === "all" ? "" : value },
                      })
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder={t.common.select || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.common.all || "All"}</SelectItem>
                      {(dict?.temperature || []).map((opt: any) => (
                        <SelectItem key={opt.id || opt.value} value={opt.value}>
                          {opt.label?.[locale] || opt.label?.ru || opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="isActive">{t.products.isActive}</Label>
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

            <div className="space-y-4">
              <Label>{t.products.images}</Label>
              <div className="grid gap-4 md:grid-cols-3">
                {(["image1", "image2", "image3"] as const).map((imageKey, index) => (
                  <div key={imageKey} className="space-y-2">
                    <Label>{t.products[imageKey]}</Label>
                    {formData.images[imageKey].base64 || formData.images[imageKey].url ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={formData.images[imageKey].base64 || formData.images[imageKey].url}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(imageKey)}
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
                            if (file) handleImageUpload(imageKey, file)
                          }}
                          className="hidden"
                          id={`upload-${imageKey}`}
                        />
                        <Label
                          htmlFor={`upload-${imageKey}`}
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                        >
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{t.products.uploadImage}</span>
                        </Label>
                      </div>
                    )}
                  </div>
                ))}
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

