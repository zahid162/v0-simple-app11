export interface ImageEffects {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  hue: number
  sepia: number
  grayscale: number
  invert: number
  vibrance: number
  exposure: number
  highlights: number
  shadows: number
  temperature: number
  tint: number
  scale: number
  rotation: number
  flipH: boolean
  flipV: boolean
  shadow: {
    enabled: boolean
    type: "drop" | "inner" | "left" | "right" | "gradient"
    offsetX: number
    offsetY: number
    blur: number
    color: string
    color2?: string
    opacity: number
    spread: number
  }
  outline: {
    enabled: boolean
    type: "solid" | "gradient" | "double" | "corners" | "corners-gradient" | "dashed" | "dotted" | "inset" | "neon-glow" | "rainbow" | "vintage" | "modern" | "artistic"
    width: number
    color: string
    color2?: string
    color3?: string
    opacity: number
    style: "outside" | "inside" | "center"
    cornerRadius?: number
    dashLength?: number
    gapLength?: number
    glowIntensity?: number
    pattern?: string
  }
  glow: {
    enabled: boolean
    type: "solid" | "gradient" | "rainbow" | "soft" | "neon" | "colorful" | "rim" | "halo" | "chromatic" | "fire" | "ice" | "aurora"
    blur: number
    color: string
    color2?: string
    color3?: string
    opacity: number
    intensity: number
    spread?: number
    style?: "outside" | "inside" | "both"
    animation?: boolean
  }
}

export interface BackgroundData {
  type: "color" | "gradient" | "pattern" | "image"
  color?: string
  gradient?: {
    type: "linear" | "radial" | "conic"
    colors: string[]
    direction: number
    stops?: number[]
  }
  pattern?: {
    type: string
    scale: number
    opacity: number
  }
  image?: {
    url: string
    fit: "cover" | "contain" | "fill" | "repeat"
    opacity: number
    blur: number
  }
} 