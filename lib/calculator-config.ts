// Calculator Configuration
// Temperature to Density mapping for укрывной материал

export interface TemperatureDensityMapping {
  minTemp: number
  maxTemp: number
  density: number
  label: string
}

export const TEMPERATURE_DENSITY_MAP: TemperatureDensityMapping[] = [
  {
    minTemp: 0,
    maxTemp: Infinity,
    density: 17,
    label: "17 г/м²",
  },
  {
    minTemp: -3,
    maxTemp: 0,
    density: 23,
    label: "23 г/м²",
  },
  {
    minTemp: -5,
    maxTemp: -3,
    density: 30,
    label: "30 г/м²",
  },
  {
    minTemp: -7,
    maxTemp: -5,
    density: 42,
    label: "42 г/м²",
  },
  {
    minTemp: -Infinity,
    maxTemp: -7,
    density: 60,
    label: "60 г/м²",
  },
]

export function getDensityByTemperature(temperature: number): number {
  const mapping = TEMPERATURE_DENSITY_MAP.find(
    (m) => temperature >= m.minTemp && temperature < m.maxTemp
  )
  return mapping?.density || 17
}

export function getDensityLabelByTemperature(temperature: number): string {
  const mapping = TEMPERATURE_DENSITY_MAP.find(
    (m) => temperature >= m.minTemp && temperature < m.maxTemp
  )
  return mapping?.label || "17 г/м²"
}

// Material types
export type MaterialType = "cover" | "mulch"

// Calculation methods
export type CalculationMethod = "total_area" | "beds"

// Calculator step types
export type CalculatorStep = 
  | "material_type"
  | "calculation_method"
  | "input_data"
  | "additional_params"
  | "result"
