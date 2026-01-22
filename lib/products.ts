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

export const products: Product[] = [
  {
    id: 1,
    name: "Agrofiber 17 g/m²",
    slug: "agrofiber-17",
    type: "cover",
    usage: ["greenhouse", "open_field"],
    color: "white",
    density: 17,
    width: 3.2,
    length: 100,
    price: 120000,
    image: "/white-agrofiber-roll-agricultural-fabric.jpg",
    description: {
      uz: "Engil qoplama material - sovuq haroratlar uchun asosiy himoya",
      ru: "Легкий укрывной материал - базовая защита от небольших заморозков",
      en: "Light cover material - basic protection from light frost",
    },
  },
  {
    id: 2,
    name: "Agrofiber 23 g/m²",
    slug: "agrofiber-23",
    type: "cover",
    usage: ["greenhouse", "open_field"],
    color: "white",
    density: 23,
    width: 3.2,
    length: 100,
    price: 150000,
    image: "/white-agrofiber-roll-23gsm-agricultural.jpg",
    description: {
      uz: "O'rtacha himoya - -3°C gacha sovuqdan himoya qiladi",
      ru: "Средняя защита - защищает от заморозков до -3°C",
      en: "Medium protection - protects from frost down to -3°C",
    },
  },
  {
    id: 3,
    name: "Agrofiber 30 g/m²",
    slug: "agrofiber-30",
    type: "cover",
    usage: ["greenhouse", "open_field"],
    color: "white",
    density: 30,
    width: 3.2,
    length: 50,
    price: 180000,
    image: "/white-agrofiber-roll-30gsm-protection.jpg",
    description: {
      uz: "Yaxshi himoya - -5°C gacha sovuqdan himoya qiladi",
      ru: "Хорошая защита - защищает от заморозков до -5°C",
      en: "Good protection - protects from frost down to -5°C",
    },
  },
  {
    id: 4,
    name: "Agrofiber 42 g/m²",
    slug: "agrofiber-42",
    type: "cover",
    usage: ["greenhouse", "open_field"],
    color: "white",
    density: 42,
    width: 3.2,
    length: 50,
    price: 220000,
    image: "/white-agrofiber-roll-42gsm-heavy-duty.jpg",
    description: {
      uz: "Kuchli himoya - -7°C gacha sovuqdan himoya qiladi",
      ru: "Сильная защита - защищает от заморозков до -7°C",
      en: "Strong protection - protects from frost down to -7°C",
    },
  },
  {
    id: 5,
    name: "Agrofiber 60 g/m²",
    slug: "agrofiber-60",
    type: "cover",
    usage: ["greenhouse", "open_field"],
    color: "white",
    density: 60,
    width: 3.2,
    length: 50,
    price: 280000,
    image: "/white-agrofiber-roll-60gsm-premium.jpg",
    description: {
      uz: "Maksimal himoya - eng og'ir sovuq uchun",
      ru: "Максимальная защита - для сильных морозов",
      en: "Maximum protection - for severe frost",
    },
  },
  {
    id: 6,
    name: "Agrofiber Mulch 50 g/m²",
    slug: "agrofiber-mulch-50",
    type: "mulch",
    usage: ["mulch"],
    color: "black",
    density: 50,
    width: 1.6,
    length: 100,
    price: 160000,
    image: "/black-mulch-agrofiber-roll-weed-control.jpg",
    description: {
      uz: "Begona o'tlarni nazorat qilish va tuproqni qoplash uchun qora mulch",
      ru: "Черная мульча для борьбы с сорняками и укрытия почвы",
      en: "Black mulch for weed control and soil covering",
    },
  },
  {
    id: 7,
    name: "Agrofiber Mulch 60 g/m²",
    slug: "agrofiber-mulch-60",
    type: "mulch",
    usage: ["mulch"],
    color: "black",
    density: 60,
    width: 1.6,
    length: 100,
    price: 190000,
    image: "/black-mulch-agrofiber-60gsm-heavy.jpg",
    description: {
      uz: "Kuchli qora mulch - uzoq muddatli begona o'tlarni nazorat qilish",
      ru: "Усиленная черная мульча - долгосрочный контроль сорняков",
      en: "Heavy-duty black mulch - long-term weed control",
    },
  },
  {
    id: 8,
    name: "Agrofiber 30 g/m² Wide",
    slug: "agrofiber-30-wide",
    type: "cover",
    usage: ["greenhouse", "open_field"],
    color: "white",
    density: 30,
    width: 4.2,
    length: 50,
    price: 230000,
    image: "/wide-white-agrofiber-roll-4m.jpg",
    description: {
      uz: "Keng rulon - katta issiqxonalar uchun",
      ru: "Широкий рулон - для больших теплиц",
      en: "Wide roll - for large greenhouses",
    },
  },
]

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
