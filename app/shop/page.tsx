import { Suspense } from "react"
import { ShopContent } from "@/components/shop-content"

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  )
}
