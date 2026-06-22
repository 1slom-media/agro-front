"use client"

import dynamic from "next/dynamic"

type FooterProps = {
  onOpenCalculator?: () => void
}

// Render footer on client only to avoid Turbopack dev hydration mismatches.
const Footer = dynamic(() => import("./footer").then((m) => m.Footer), { ssr: false })

export function FooterLazy(props: FooterProps) {
  return <Footer {...props} />
}

