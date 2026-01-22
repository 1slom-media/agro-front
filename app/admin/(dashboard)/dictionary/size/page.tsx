"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Pencil, Trash2, ArrowLeft, Ruler } from "lucide-react"
import { dictionaryApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

export default function SizeDictionaryPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    width: "",
    length: "",
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
      const response = await dictionaryApi.listByType('size', { all: true })
      setItems((response || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)))
    } catch (error) {
      console.error("Failed to load sizes:", error)
      toast({
        title: t.common.error,
        description: "Failed to load sizes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const parseSizeValue = (value: string) => {
    // Parse "1,3х200" or "1.3x200" format
    const match = value.match(/([\d,\.]+)\s*[xх]\s*(\d+)/i)
    if (match) {
      return {
        width: match[1].replace(',', '.'),
        length: match[2],
      }
    }
    return { width: "", length: "" }
  }

  const formatSizeValue = (width: string, length: string) => {
    if (!width || !length) return ""
    return `${width.replace('.', ',')}х${length}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const sizeValue = formatSizeValue(formData.width, formData.length)
      // Auto-generate label from value
      const autoLabel = {
        uz: `${sizeValue} м`,
        ru: `${sizeValue} м`,
        en: `${sizeValue.replace('х', 'x')} m`,
      }
      
      if (editingId) {
        await dictionaryApi.update(editingId, {
          type: 'size',
          value: sizeValue,
          label: autoLabel,
          isActive: formData.isActive,
          order: formData.order,
        })
        toast({
          title: t.common.success,
          description: t.dictionary.updated,
        })
      } else {
        await dictionaryApi.create({
          type: 'size',
          value: sizeValue,
          label: autoLabel,
          isActive: formData.isActive,
          order: formData.order,
        })
        toast({
          title: t.common.success,
          description: t.dictionary.created,
        })
      }
      resetForm()
      loadItems()
    } catch (error: any) {
      console.error("Failed to save size:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    const parsed = parseSizeValue(item.value)
    setFormData({
      width: parsed.width,
      length: parsed.length,
      label: item.label || { uz: "", ru: "", en: "" },
      isActive: item.isActive !== undefined ? item.isActive : true,
      order: item.order || 0,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      width: "",
      length: "",
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
      console.error("Failed to delete size:", error)
      toast({
        title: t.common.error,
        description: "Failed to delete size",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Ruler className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">
            {locale === 'uz' ? 'O\'lcham (Boyi va Eni)' : 'Размер (Ширина и Длина)'}
          </h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t.dictionary.editItem : t.dictionary.createNew}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="width">
                    {locale === 'uz' ? 'Eni' : 'Ширина'} (м)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    placeholder={locale === 'uz' ? 'Masalan: 1,3' : 'Например: 1,3'}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">
                    {locale === 'uz' ? 'Boyi' : 'Длина'} (м)
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    placeholder={locale === 'uz' ? 'Masalan: 200' : 'Например: 200'}
                    required
                  />
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">
                  {locale === 'uz' ? 'Natija:' : 'Результат:'}
                </p>
                <p className="text-lg font-bold">
                  {formData.width && formData.length 
                    ? formatSizeValue(formData.width, formData.length)
                    : locale === 'uz' ? 'O\'lcham kiriting' : 'Введите размер'}
                </p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">
                  {locale === 'uz' ? 'Avtomatik yaratiladi:' : 'Будет создано автоматически:'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.width && formData.length 
                    ? `${formatSizeValue(formData.width, formData.length)} м`
                    : locale === 'uz' ? 'O\'lcham kiriting' : 'Введите размер'}
                </p>
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
            <CardTitle>{locale === 'uz' ? 'O\'lchamlar ro\'yxati' : 'Список размеров'}</CardTitle>
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
                    <TableHead>{locale === 'uz' ? 'O\'lcham' : 'Размер'}</TableHead>
                    <TableHead>{t.dictionary.label}</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.value}
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
                  ))}
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
