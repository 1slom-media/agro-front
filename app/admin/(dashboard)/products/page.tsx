"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Pencil, Trash2 } from "lucide-react"
import { productsApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

export default function ProductsPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()
  
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    loadProducts()
  }, [page, limit])

  useEffect(() => {
    const handleLocaleChange = (e: CustomEvent) => {
      setLocale(e.detail)
    }
    const handleStorageChange = () => {
      const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
      if (savedLocale) {
        setLocale(savedLocale)
      }
    }
    window.addEventListener("adminLocaleChange", handleLocaleChange as EventListener)
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("adminLocaleChange", handleLocaleChange as EventListener)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const loadProducts = async () => {
    try {
      const response = await productsApi.getAll({ page, limit })
      setProducts(response.data || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error("Failed to load products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await productsApi.delete(deleteId)
      toast({
        title: t.common.success,
        description: t.products.deleted,
      })
      setDeleteId(null)
      loadProducts()
    } catch (error: any) {
      console.error("Failed to delete product:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    }
  }

  const getProductImage = (product: any) => {
    if (product.images?.image1?.url) return product.images.image1.url
    if (product.images?.image1?.base64) return product.images.image1.base64
    if (product.imageUrl) return product.imageUrl
    if (product.imageBase64) return product.imageBase64
    return "/placeholder.svg"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">{t.common.loading}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.products.title}</h1>
          <p className="text-muted-foreground">
            {t.common.total}: {total}
          </p>
        </div>
        <Link href="/admin/products/create">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            {t.products.createNew}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.products.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.products.images}</TableHead>
                <TableHead>{t.products.name}</TableHead>
                <TableHead>{t.products.category}</TableHead>
                <TableHead>{t.products.price}</TableHead>
                <TableHead>{t.common.status}</TableHead>
                <TableHead className="text-right">{t.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name[locale]}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name[locale]}</TableCell>
                  <TableCell>{product.category?.name?.[locale] || "-"}</TableCell>
                  <TableCell>{product.price ? `${product.price} UZS` : "-"}</TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <Badge variant="default">{t.common.active}</Badge>
                    ) : (
                      <Badge variant="secondary">{t.common.inactive}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(product.id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {products.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {t.common.noData || "No products found"}
            </div>
          )}

          {total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Select value={limit.toString()} onValueChange={(value) => { setLimit(Number(value)); setPage(1); }}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue>{t.common.itemsPerPage}: {limit}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                  className="cursor-pointer"
              >
                {t.common.previous}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t.common.page} {page} {t.common.of} {Math.ceil(total / limit)}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / limit)}
                  className="cursor-pointer"
              >
                {t.common.next}
              </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.products.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground">
              {t.common.deleteWarning || "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

