// Generates build/icon.png: a flat rounded-square app icon with a checkmark glyph.
// Written as a minimal raw PNG encoder (no image dependencies) since this is a
// placeholder icon meant to be swapped for real artwork later.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'build')
mkdirSync(outDir, { recursive: true })

const SIZE = 1024
const ACCENT = [99, 102, 241] // indigo-500
const ACCENT_DARK = [67, 56, 202] // indigo-700
const WHITE = [255, 255, 255]

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function roundedRectAlpha(px, py, size, radius) {
  const x = Math.min(px, size - px)
  const y = Math.min(py, size - py)
  if (x >= radius && y >= radius) return 1
  if (x >= radius || y >= radius) return 1
  const dx = radius - x
  const dy = radius - y
  const dist = Math.sqrt(dx * dx + dy * dy)
  return 1 - smoothstep(radius - 1.5, radius + 1.5, dist)
}

function distToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax
  const aby = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / (abx * abx + aby * aby)))
  const cx = ax + t * abx
  const cy = ay + t * aby
  return Math.hypot(px - cx, py - cy)
}

const radius = SIZE * 0.22
const thickness = SIZE * 0.085
const p1 = [SIZE * 0.26, SIZE * 0.53]
const p2 = [SIZE * 0.43, SIZE * 0.7]
const p3 = [SIZE * 0.76, SIZE * 0.32]

const buf = Buffer.alloc(SIZE * SIZE * 4)

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const i = (y * SIZE + x) * 4
    const t = y / SIZE
    const r = ACCENT[0] + (ACCENT_DARK[0] - ACCENT[0]) * t
    const g = ACCENT[1] + (ACCENT_DARK[1] - ACCENT[1]) * t
    const b = ACCENT[2] + (ACCENT_DARK[2] - ACCENT[2]) * t

    const shapeAlpha = roundedRectAlpha(x, y, SIZE, radius)

    const d1 = distToSegment(x, y, p1[0], p1[1], p2[0], p2[1])
    const d2 = distToSegment(x, y, p2[0], p2[1], p3[0], p3[1])
    const checkDist = Math.min(d1, d2)
    const checkAlpha = 1 - smoothstep(thickness / 2 - 1.5, thickness / 2 + 1.5, checkDist)

    const cr = r + (WHITE[0] - r) * checkAlpha
    const cg = g + (WHITE[1] - g) * checkAlpha
    const cb = b + (WHITE[2] - b) * checkAlpha

    buf[i] = Math.round(cr)
    buf[i + 1] = Math.round(cg)
    buf[i + 2] = Math.round(cb)
    buf[i + 3] = Math.round(255 * shapeAlpha)
  }
}

// --- minimal PNG encoder ---
const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(bytes) {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([length, typeBuf, data, crcBuf])
}

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0)
ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // color type RGBA
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0

const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE)
for (let y = 0; y < SIZE; y++) {
  const rowStart = y * (SIZE * 4 + 1)
  raw[rowStart] = 0 // filter type: none
  buf.copy(raw, rowStart + 1, y * SIZE * 4, (y + 1) * SIZE * 4)
}

const idat = deflateSync(raw, { level: 9 })

const png = Buffer.concat([
  signature,
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0))
])

writeFileSync(join(outDir, 'icon.png'), png)
console.log(`Generated ${join(outDir, 'icon.png')} (${SIZE}x${SIZE})`)
