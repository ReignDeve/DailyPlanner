export function parseRgba(input: string): { r: number; g: number; b: number; a: number } {
  const match = input.match(/rgba?\(([^)]+)\)/)
  if (!match) return { r: 17, g: 24, b: 39, a: 0.55 }
  const [r, g, b, a = 1] = match[1].split(',').map((part) => parseFloat(part.trim()))
  return { r, g, b, a }
}

export function toRgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}
