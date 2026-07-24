// Единый набор SVG-иконок (line style, без эмодзи)
const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const HomeIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z"/></svg>
)
export const WheelIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>
)
export const LightbulbIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>
)
export const HeartIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
)
export const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15z"/></svg>
)
export const BackIcon = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M15 18l-6-6 6-6"/></svg>
)
export const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M9 6l6 6-6 6"/></svg>
)
export const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
)
export const EditIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
)
export const PlusIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M12 5v14M5 12h14"/></svg>
)
export const CheckIcon = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="3"><path d="M5 12l5 5 9-11"/></svg>
)
export const SunIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
)
export const MoonIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
)
export const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
)
export const SendIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
)
export const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
)
export const MessageIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
)
export const LinkIcon = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
)
export const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7c-2.2 0-4 1.8-4 4s1.8 4 4 4c0 2-1.5 3-3 3v2c3.3 0 6-2.7 6-6V7H7zm10 0c-2.2 0-4 1.8-4 4s1.8 4 4 4c0 2-1.5 3-3 3v2c3.3 0 6-2.7 6-6V7h-3z"/></svg>
)
