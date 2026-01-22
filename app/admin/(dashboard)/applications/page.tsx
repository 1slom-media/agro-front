"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye } from "lucide-react"
import { applicationsApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

export default function ApplicationsPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()
  
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    loadApplications()
  }, [page, statusFilter, limit])

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

  const loadApplications = async () => {
    try {
      const params: any = { page, limit }
      if (statusFilter !== "all") {
        params.status = statusFilter
      }
      const response = await applicationsApi.getAll(params)
      setApplications(response.data || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error("Failed to load applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await applicationsApi.updateStatus(id, newStatus)
      toast({
        title: t.common.success,
        description: t.applications.updated,
      })
      loadApplications()
    } catch (error: any) {
      console.error("Failed to update status:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">{t.applications.statusNew}</Badge>
      case "in_progress":
        return <Badge className="bg-blue-600">{t.applications.statusInProgress}</Badge>
      case "completed":
        return <Badge className="bg-green-600">{t.applications.statusCompleted}</Badge>
      case "cancelled":
        return <Badge variant="secondary">{t.applications.statusCancelled}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
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
          <h1 className="text-3xl font-bold tracking-tight">{t.applications.title}</h1>
          <p className="text-muted-foreground">
            {t.common.total}: {total}
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t.applications.allStatuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.applications.allStatuses}</SelectItem>
            <SelectItem value="new">{t.applications.statusNew}</SelectItem>
            <SelectItem value="in_progress">{t.applications.statusInProgress}</SelectItem>
            <SelectItem value="completed">{t.applications.statusCompleted}</SelectItem>
            <SelectItem value="cancelled">{t.applications.statusCancelled}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.applications.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.applications.name}</TableHead>
                <TableHead>{t.applications.phone}</TableHead>
                <TableHead>{t.applications.type}</TableHead>
                <TableHead>{t.applications.message}</TableHead>
                <TableHead>{t.applications.status}</TableHead>
                <TableHead>{t.applications.createdAt}</TableHead>
                <TableHead className="text-right">{t.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {app.type === "contact" && t.applications.typeContact}
                      {app.type === "quote" && t.applications.typeQuote}
                      {app.type === "consultation" && t.applications.typeConsultation}
                      {app.type === "other" && t.applications.typeOther}
                      {!app.type && "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{app.message || "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onValueChange={(value) => handleStatusChange(app.id, value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue>{getStatusBadge(app.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">{t.applications.statusNew}</SelectItem>
                        <SelectItem value="in_progress">{t.applications.statusInProgress}</SelectItem>
                        <SelectItem value="completed">{t.applications.statusCompleted}</SelectItem>
                        <SelectItem value="cancelled">{t.applications.statusCancelled}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(app.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/applications/${app.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {applications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {t.common.noData || "No applications found"}
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
    </div>
  )
}

