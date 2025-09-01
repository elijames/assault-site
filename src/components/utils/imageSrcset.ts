import type { ImageMetadata } from 'astro';

// Breakpoints matching Tailwind config
const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Preset size configurations
const sizePresets = {
  // Full width on all screens
  full: {
    xs: 100,
    sm: 100,
    md: 100,
    lg: 100,
    xl: 100,
    '2xl': 100
  },
  // Full width on mobile, half width on larger screens
  half: {
    xs: 100,
    sm: 100,
    md: 50,
    lg: 50,
    xl: 50,
    '2xl': 50
  },
  // Full width on mobile, third width on larger screens
  third: {
    xs: 100,
    sm: 100,
    md: 50,
    lg: 33,
    xl: 33,
    '2xl': 33
  },
  // Small fixed sizes
  logo: {
    xs: 150,
    sm: 175,
    md: 200,
    lg: 225,
    xl: 250,
    '2xl': 300
  },
  // Hero image sizes
  hero: {
    xs: 100,
    sm: 100,
    md: 100,
    lg: 90,
    xl: 80,
    '2xl': 70
  },
  // Content image sizes
  content: {
    xs: 100,
    sm: 90,
    md: 80,
    lg: 70,
    xl: 60,
    '2xl': 50
  }
} as const;

type SizePreset = keyof typeof sizePresets;

interface SrcsetOptions {
  src: ImageMetadata;
  preset?: SizePreset;
  widths?: number[];
  sizes?: string;
  baseSize?: Partial<Record<keyof typeof breakpoints, number>>;
}

function generateSizesAttribute(
  preset: SizePreset | undefined,
  baseSize: Partial<Record<keyof typeof breakpoints, number>> | undefined
): string {
  // Use preset if provided, otherwise use baseSize or default to full
  const sizeConfig = preset 
    ? sizePresets[preset]
    : baseSize 
    ? { ...sizePresets.full, ...baseSize }
    : sizePresets.full;

  const breakpointEntries = Object.entries(breakpoints)
    .sort(([, a], [, b]) => b - a) // Sort by breakpoint value, largest first
    .map(([key, value]) => {
      const size = sizeConfig[key as keyof typeof breakpoints];
      // If size is a whole number > 100, treat it as a fixed pixel width
      const sizeStr = size > 100 ? `${size}px` : `${size}vw`;
      return `(min-width: ${value}px) ${sizeStr}`;
    });

  // Use the smallest breakpoint size as default
  const defaultSize = sizeConfig.xs;
  const defaultSizeStr = defaultSize > 100 ? `${defaultSize}px` : `${defaultSize}vw`;

  return [...breakpointEntries, defaultSizeStr].join(', ');
}

export function generateSrcset({ 
  src, 
  preset,
  widths = Object.values(breakpoints),
  sizes,
  baseSize
}: SrcsetOptions) {
  // Filter widths that don't exceed original image width and remove duplicates
  const validWidths = [...new Set(widths)]
    .filter(width => width <= src.width)
    .sort((a, b) => a - b);

  return {
    widths: validWidths,
    sizes: sizes || generateSizesAttribute(preset, baseSize)
  };
}
