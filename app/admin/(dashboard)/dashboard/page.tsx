"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderTree, FileText, Mail } from "lucide-react"
import { productsApi, categoriesApi, blogApi, applicationsApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"

export default function DashboardPage() {
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBlogPosts: 0,
    totalApplications: 0,
    newApplications: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentApplications, setRecentApplications] = useState<any[]>([])

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    loadStats()
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

  const loadStats = async () => {
    try {
      const [products, categories, blog, applications, appStats] = await Promise.all([
        productsApi.getAll({ page: 1, limit: 1 }),
        categoriesApi.getAll({ page: 1, limit: 1 }),
        blogApi.getAll({ page: 1, limit: 1, isPublished: 'all' }),
        applicationsApi.getAll({ page: 1, limit: 5 }),
        applicationsApi.getStats(),
      ])

      setStats({
        totalProducts: products.total || 0,
        totalCategories: categories.total || 0,
        totalBlogPosts: blog.total || 0,
        totalApplications: appStats.total || 0,
        newApplications: appStats.new || 0,
      })
      
      setRecentApplications(applications.data || [])
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: t.dashboard.totalProducts,
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: t.dashboard.totalCategories,
      value: stats.totalCategories,
      icon: FolderTree,
      color: "text-green-600",
    },
    {
      title: t.dashboard.totalBlogPosts,
      value: stats.totalBlogPosts,
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: t.dashboard.totalApplications,
      value: stats.totalApplications,
      icon: Mail,
      color: "text-orange-600",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">{t.common.loading}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
        <p className="text-muted-foreground">{t.dashboard.statistics}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {stats.newApplications > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.newApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.newApplications}</div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentApplications}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentApplications.length === 0 ? (
            <p className="text-muted-foreground">{t.common.loading}</p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">{app.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {app.status === "new" && t.applications.statusNew}
                      {app.status === "in_progress" && t.applications.statusInProgress}
                      {app.status === "completed" && t.applications.statusCompleted}
                      {app.status === "cancelled" && t.applications.statusCancelled}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

