"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/toaster"
import {
  LayoutDashboard,
  FolderTree,
  Package,
  FileText,
  Mail,
  Menu,
  LogOut,
  Globe,
  Users,
  BookOpen,
} from "lucide-react"
import { tokenManager } from "@/lib/api-client"
import { useAdminTranslation } from "@/lib/admin-i18n"
import type { AdminLocale } from "@/lib/admin-i18n"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = useState<AdminLocale>("ru")
  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const t = useAdminTranslation(locale)

  useEffect(() => {
    setMounted(true)
    // Check authentication
    const token = tokenManager.getToken()
    if (!token) {
      router.push("/admin/login")
      return
    }
    
    // Decode token to get user role
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUserRole(payload.role || null)
    } catch (e) {
      console.error("Failed to decode token:", e)
    }
    
    // Load saved locale
    const savedLocale = localStorage.getItem("admin_locale") as AdminLocale
    if (savedLocale) {
      setLocale(savedLocale)
    }
  }, [router])

  const handleLocaleChange = (newLocale: AdminLocale) => {
    setLocale(newLocale)
    localStorage.setItem("admin_locale", newLocale)
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent("adminLocaleChange", { detail: newLocale }))
  }

  const handleLogout = () => {
    tokenManager.removeToken()
    router.push("/admin/login")
  }

  const navigation = [
    {
      name: t.nav.dashboard,
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t.nav.categories,
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      name: t.nav.products,
      href: "/admin/products",
      icon: Package,
    },
    {
      name: t.nav.blog,
      href: "/admin/blog",
      icon: FileText,
    },
    {
      name: t.nav.applications,
      href: "/admin/applications",
      icon: Mail,
    },
    // Only show users menu for admin
    ...(userRole === "admin" ? [{
      name: t.nav.users,
      href: "/admin/users",
      icon: Users,
    }] : []),
    {
      name: t.nav.dictionary,
      href: "/admin/dictionary",
      icon: BookOpen,
    },
  ]

  if (!mounted) {
    return null
  }

  const Sidebar = () => (
    <div className="flex h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6 text-green-600" />
          <span>Agrovolokno</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="grid gap-1 py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent cursor-pointer ${
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4" />
          <div className="flex gap-1">
            <Button
              variant={locale === "uz" ? "default" : "outline"}
              size="sm"
              onClick={() => handleLocaleChange("uz")}
              className="cursor-pointer"
            >
              UZ
            </Button>
            <Button
              variant={locale === "ru" ? "default" : "outline"}
              size="sm"
              onClick={() => handleLocaleChange("ru")}
              className="cursor-pointer"
            >
              RU
            </Button>
          </div>
        </div>
        <Button variant="outline" className="w-full cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t.nav.logout}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
      <div className="hidden border-r bg-muted/40 md:block h-screen overflow-hidden">
        <Sidebar />
      </div>
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 cursor-pointer">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-y-auto gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

