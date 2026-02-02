export type UsageType = "greenhouse" | "open_field" | "mulch"

export interface Product {
  id: number
  name: string
  slug: string
  type: "cover" | "mulch"
  usage: UsageType[]
  color: "white" | "black"
  density: number
  width: number
  length: number
  price: number
  image: string
  description: {
    uz: string
    ru: string
    en: string
  }
}

export const products: Product[] = []

// Density selection based on temperature
export function getDensityByTemperature(temp: number): number {
  if (temp >= 0) return 17
  if (temp >= -3) return 23
  if (temp >= -5) return 30
  if (temp >= -7) return 42
  return 60
}

// Calculate rolls needed
export function calculateRolls(
  areaLength: number,
  areaWidth: number,
  usage: UsageType,
  temperature: number,
): { product: Product | null; rollCount: number; totalPrice: number } {
  const density = usage === "mulch" ? 50 : getDensityByTemperature(temperature)

  // Filter products by usage and density
  const matchingProducts = products.filter((p) => p.usage.includes(usage) && p.density === density)

  if (matchingProducts.length === 0) {
    // Find closest density
    const availableProducts = products.filter((p) => p.usage.includes(usage))
    if (availableProducts.length === 0) return { product: null, rollCount: 0, totalPrice: 0 }

    const sortedByDensity = availableProducts.sort(
      (a, b) => Math.abs(a.density - density) - Math.abs(b.density - density),
    )
    matchingProducts.push(sortedByDensity[0])
  }

  // Filter by width (must be >= area width)
  const suitableProducts = matchingProducts.filter((p) => p.width >= areaWidth)

  if (suitableProducts.length === 0) {
    // If no product is wide enough, use the widest one
    const widest = matchingProducts.sort((a, b) => b.width - a.width)[0]
    const rollCount = Math.ceil(areaLength / widest.length)
    return { product: widest, rollCount, totalPrice: rollCount * widest.price }
  }

  // Select optimal roll (minimum rolls, minimum waste)
  const withCalculations = suitableProducts.map((p) => ({
    product: p,
    rollCount: Math.ceil(areaLength / p.length),
    waste: (p.width - areaWidth) * areaLength,
  }))

  // Sort by roll count first, then by waste
  withCalculations.sort((a, b) => {
    if (a.rollCount !== b.rollCount) return a.rollCount - b.rollCount
    return a.waste - b.waste
  })

  const best = withCalculations[0]
  return {
    product: best.product,
    rollCount: best.rollCount,
    totalPrice: best.rollCount * best.product.price,
  }
}
