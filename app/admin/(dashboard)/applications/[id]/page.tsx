"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { applicationsApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

export default function ApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<any>(null)

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    loadApplication()
  }, [])

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

  const loadApplication = async () => {
    try {
      const data = await applicationsApi.getOne(params.id as string)
      setApplication(data)
    } catch (error: any) {
      console.error("Failed to load application:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await applicationsApi.updateStatus(params.id as string, newStatus)
      setApplication({ ...application, status: newStatus })
      toast({
        title: t.common.success,
        description: t.applications.updated,
      })
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

  if (!application) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">{t.common.error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.applications.details}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.applications.details}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t.applications.name}</Label>
              <div className="text-lg font-medium">{application.name}</div>
            </div>
            <div className="space-y-2">
              <Label>{t.applications.phone}</Label>
              <div className="text-lg font-medium">
                <a href={`tel:${application.phone}`} className="text-blue-600 hover:underline cursor-pointer">
                  {application.phone}
                </a>
              </div>
            </div>
          </div>

          {application.email && (
            <div className="space-y-2">
              <Label>{t.applications.email}</Label>
              <div className="text-lg font-medium">
                <a href={`mailto:${application.email}`} className="text-blue-600 hover:underline cursor-pointer">
                  {application.email}
                </a>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t.applications.type}</Label>
              <div>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {application.type === "contact" && t.applications.typeContact}
                  {application.type === "quote" && t.applications.typeQuote}
                  {application.type === "consultation" && t.applications.typeConsultation}
                  {application.type === "other" && t.applications.typeOther}
                  {!application.type && "-"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.applications.status}</Label>
              <Select value={application.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue>{getStatusBadge(application.status)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t.applications.statusNew}</SelectItem>
                  <SelectItem value="in_progress">{t.applications.statusInProgress}</SelectItem>
                  <SelectItem value="completed">{t.applications.statusCompleted}</SelectItem>
                  <SelectItem value="cancelled">{t.applications.statusCancelled}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {application.message && (
            <div className="space-y-2">
              <Label>{t.applications.message}</Label>
              <div className="text-base p-4 bg-muted rounded-lg whitespace-pre-wrap break-words">
                {application.message}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t.applications.createdAt}</Label>
              <div className="text-lg font-medium">
                {new Date(application.createdAt).toLocaleString(locale === "uz" ? "uz-UZ" : "ru-RU")}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
              {t.common.back}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

