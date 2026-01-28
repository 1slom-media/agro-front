"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, ArrowLeft, Palette } from "lucide-react"
import { dictionaryApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

const COLOR_OPTIONS = [
  { value: 'white', label: { uz: 'Oq', ru: 'Белый', en: 'White' }, hex: '#FFFFFF' },
  { value: 'black', label: { uz: 'Qora', ru: 'Черный', en: 'Black' }, hex: '#000000' },
  { value: 'white-black', label: { uz: 'Oq-Qora', ru: 'Белый-Черный', en: 'White-Black' }, hex: '#808080' },
  { value: 'red', label: { uz: 'Qizil', ru: 'Красный', en: 'Red' }, hex: '#EF4444' },
  { value: 'blue', label: { uz: 'Ko\'k', ru: 'Синий', en: 'Blue' }, hex: '#3B82F6' },
  { value: 'green', label: { uz: 'Yashil', ru: 'Зеленый', en: 'Green' }, hex: '#22C55E' },
  { value: 'yellow', label: { uz: 'Sariq', ru: 'Желтый', en: 'Yellow' }, hex: '#FBBF24' },
  { value: 'orange', label: { uz: 'To\'q sariq', ru: 'Оранжевый', en: 'Orange' }, hex: '#F97316' },
  { value: 'purple', label: { uz: 'Binafsha', ru: 'Фиолетовый', en: 'Purple' }, hex: '#A855F7' },
  { value: 'pink', label: { uz: 'Pushti', ru: 'Розовый', en: 'Pink' }, hex: '#EC4899' },
  { value: 'brown', label: { uz: 'Jigarrang', ru: 'Коричневый', en: 'Brown' }, hex: '#92400E' },
  { value: 'gray', label: { uz: 'Kulrang', ru: 'Серый', en: 'Gray' }, hex: '#6B7280' },
  { value: 'cyan', label: { uz: 'Moviy', ru: 'Голубой', en: 'Cyan' }, hex: '#06B6D4' },
]

export default function ColorDictionaryPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    value: "",
    label: { uz: "", ru: "", en: "" },
    isActive: true,
    order: 0,
  })

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    const handleLocaleChange = (e: CustomEvent) => {
      setLocale(e.detail)
    }
    window.addEventListener("adminLocaleChange" as any, handleLocaleChange)
    return () => {
      window.removeEventListener("adminLocaleChange" as any, handleLocaleChange)
    }
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const response = await dictionaryApi.listByType('color', { all: true })
      setItems((response || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)))
    } catch (error) {
      console.error("Failed to load colors:", error)
      toast({
        title: t.common.error,
        description: "Failed to load colors",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleColorSelect = (color: typeof COLOR_OPTIONS[0]) => {
    setFormData({
      ...formData,
      value: color.value,
      label: color.label,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await dictionaryApi.update(editingId, {
          type: 'color',
          ...formData,
        })
        toast({
          title: t.common.success,
          description: t.dictionary.updated,
        })
      } else {
        await dictionaryApi.create({
          type: 'color',
          ...formData,
        })
        toast({
          title: t.common.success,
          description: t.dictionary.created,
        })
      }
      resetForm()
      loadItems()
    } catch (error: any) {
      console.error("Failed to save color:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setFormData({
      value: item.value,
      label: item.label || { uz: "", ru: "", en: "" },
      isActive: item.isActive !== undefined ? item.isActive : true,
      order: item.order || 0,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      value: "",
      label: { uz: "", ru: "", en: "" },
      isActive: true,
      order: 0,
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await dictionaryApi.delete(deleteId)
      toast({
        title: t.common.success,
        description: t.dictionary.deleted,
      })
      loadItems()
    } catch (error) {
      console.error("Failed to delete color:", error)
      toast({
        title: t.common.error,
        description: "Failed to delete color",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const selectedColor = COLOR_OPTIONS.find(c => c.value === formData.value)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{t.dictionary.color}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t.dictionary.editItem : t.dictionary.createNew}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{locale === 'uz' ? 'Rang tanlash' : 'Выберите цвет'}</Label>
                <div className="grid grid-cols-6 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`h-12 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.value === color.value
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label[locale]}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-muted-foreground">
                    {locale === 'uz' ? 'Tanlangan:' : 'Выбрано:'} {selectedColor.label[locale]}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label>{t.dictionary.label}</Label>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="label-uz" className="text-xs">{t.dictionary.labelUz}</Label>
                    <Input
                      id="label-uz"
                      value={formData.label.uz}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          label: { ...formData.label, uz: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="label-ru" className="text-xs">{t.dictionary.labelRu}</Label>
                    <Input
                      id="label-ru"
                      value={formData.label.ru}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          label: { ...formData.label, ru: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="label-en" className="text-xs">{t.dictionary.labelEn}</Label>
                    <Input
                      id="label-en"
                      value={formData.label.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          label: { ...formData.label, en: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="order">{t.dictionary.order}</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {t.dictionary.isActive}
                  </Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="cursor-pointer">
                  {editingId ? t.common.save : t.common.create}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm} className="cursor-pointer">
                    {t.common.cancel}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === 'uz' ? 'Ranglar ro\'yxati' : 'Список цветов'}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">{t.common.loading}</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">{t.common.noData}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === 'uz' ? 'Rang' : 'Цвет'}</TableHead>
                    <TableHead>{t.dictionary.label}</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item: any) => {
                    const colorOption = COLOR_OPTIONS.find(c => c.value === item.value)
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          {colorOption ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: colorOption.hex }}
                              />
                              <span className="font-medium">{item.value}</span>
                            </div>
                          ) : (
                            <span className="font-medium">{item.value}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{item.label?.[locale] || '-'}</div>
                            {item.label?.uz && item.label.uz !== item.label?.[locale] && (
                              <div className="text-xs text-muted-foreground">UZ: {item.label.uz}</div>
                            )}
                            {item.label?.en && item.label.en !== item.label?.[locale] && (
                              <div className="text-xs text-muted-foreground">EN: {item.label.en}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? t.common.active : t.common.inactive}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item)}
                              className="cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(item.id)}
                              className="cursor-pointer text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.common.confirm}</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground">
              {t.dictionary.deleteConfirm}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="cursor-pointer">
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
