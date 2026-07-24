// Цветовые палитры колеса
export const PALETTES = {
  sunset: { name: 'Закат', colors: ['#ff5c8a', '#ff8a5c', '#ffc85c', '#7ee89a', '#5ce0ff', '#a68cff'] },
  ocean:  { name: 'Океан', colors: ['#0ea5e9', '#22d3ee', '#2dd4bf', '#38bdf8', '#818cf8', '#0284c7'] },
  pastel: { name: 'Пастель', colors: ['#ffc4dd', '#ffe0b3', '#fff3b0', '#c8f0d8', '#bfe3ff', '#d9c8ff'] },
  neon:   { name: 'Неон', colors: ['#ff2ee6', '#00f0ff', '#aeff00', '#ff9d00', '#ff2ee6', '#7c3aed'] },
}

// строит conic-gradient по числу секторов
export function conicGradient(colors, count) {
  const step = 360 / count
  const stops = []
  for (let i = 0; i < count; i++) {
    const c = colors[i % colors.length]
    stops.push(`${c} ${i * step}deg ${(i + 1) * step}deg`)
  }
  return `conic-gradient(from 0deg, ${stops.join(', ')})`
}

// цвет конкретного сектора
export function segColor(colors, i) {
  return colors[i % colors.length]
}
