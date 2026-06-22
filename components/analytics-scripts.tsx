"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/next"
import { YandexMetrica } from "@/components/yandex-metrica"
import { siteConfig } from "@/lib/seo"

export function AnalyticsScripts() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Analytics />
      {siteConfig.yandexMetrica.id && (
        <YandexMetrica ymId={siteConfig.yandexMetrica.id} />
      )}
    </>
  )
}
