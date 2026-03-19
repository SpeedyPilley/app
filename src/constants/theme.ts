// ============================================================
// Habitarium — Visual Theme
// ============================================================
// All the colours, fonts, sizes, and spacing used across the app.
// Changing values here updates the look everywhere at once.
// ============================================================

export const Colors = {
  /** Warm cream background — feels like parchment */
  background: "#FFF8F0",
  /** Slightly darker cream for cards */
  surface: "#FFF1E6",
  /** Soft coral — primary action colour */
  primary: "#FF8A80",
  /** Darker coral for pressed states */
  primaryDark: "#E57373",
  /** Sage green — secondary / success */
  secondary: "#A8D5BA",
  /** Golden yellow — accents, streaks, celebrations */
  accent: "#FFD54F",
  /** Warm dark brown — main text colour */
  text: "#4E3B2A",
  /** Lighter brown — secondary text */
  textLight: "#8B7355",
  /** Muted lavender — used for sad/neglected states */
  muted: "#C5B8D4",
  /** Soft white for overlays */
  white: "#FFFFFF",
  /** Gentle border colour */
  border: "#F0E0D0",
  /** Danger / destructive (still soft) */
  danger: "#FF7043",
  /** Transparent overlay */
  overlay: "rgba(78, 59, 42, 0.4)",
} as const;

export const Fonts = {
  /** We use system fonts for MVP. Swap to Nunito/Quicksand later. */
  regular: "System",
  bold: "System",
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    hero: 40,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

/** Creature mood → colour mapping for quick visual feedback */
export const MoodColors: Record<string, string> = {
  ecstatic: "#FFD54F",
  happy: "#A8D5BA",
  neutral: "#FFF1E6",
  sad: "#C5B8D4",
  very_sad: "#B0A0B8",
};
