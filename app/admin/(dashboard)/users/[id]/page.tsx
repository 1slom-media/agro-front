"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { usersApi } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"
import { useToast } from "@/components/ui/use-toast"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const t = useAdminTranslation(locale)
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "manager" as "admin" | "manager",
    isActive: true,
  })

  useEffect(() => {
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const user = await usersApi.getOne(params.id as string)
      setFormData({
        username: user.username,
        email: user.email,
        password: "",
        role: user.role,
        isActive: user.isActive,
      })
    } catch (error: any) {
      console.error("Failed to load user:", error)
      toast({
        title: t.common.error,
        description: error.message || t.common.error,
        variant: "destructive",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData: any = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      }
      if (formData.password) {
        updateData.password = formData.password
      }
      await usersApi.update(params.id as string, updateData)
      toast({
        title: t.common.success,
        description: t.users.updated,
      })
      router.push("/admin/users")
    } catch (error: any) {
      console.error("Failed to update user:", error)
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
        <Button variant="outline" size="icon" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.users.editUser}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t.users.editUser}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">{t.users.username}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.users.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">{t.users.password} (leave empty to keep current)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={6}
                  placeholder="Leave empty to keep current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t.users.role}</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as "admin" | "manager" })}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t.users.roleAdmin}</SelectItem>
                    <SelectItem value="manager">{t.users.roleManager}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">{t.users.isActive}</Label>
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


