"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const GeminiChat = dynamic(
  () => import("./gemini-chat").then((m) => m.GeminiChat),
  { ssr: false },
)

export function GeminiChatLazy() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }

    const timer = window.setTimeout(() => setReady(true), 2500)
    return () => window.clearTimeout(timer)
  }, [])

  if (!ready) return null
  return <GeminiChat />
}
