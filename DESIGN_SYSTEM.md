# Design System for Blog UI

A modern, premium design system for a professional software engineering blog.
This system is dark-mode-first, minimal, and inspired by Vercel and Linear.

## 1. Color Palette

### Core colors
- `--bg-primary`: `#0B0D11` — deep near-black background. Main canvas for dark mode.
- `--bg-surface`: `#13171F` — slightly lifted surface on dark backgrounds.
- `--bg-muted`: `#181E27` — subtle contrast layer for cards and panels.
- `--border`: `#2F3846` — fine, low-contrast border tone.
- `--text-primary`: `#F8FAFC` — high-contrast white for headings and body text.
- `--text-secondary`: `#BAC7D6` — softer secondary text.
- `--text-muted`: `#7B8A9D` — subtle captions and metadata.
- `--accent`: `#7C61FF` — reserved for links, primary buttons, and highlights.
- `--accent-soft`: `#4E3CFF` — hover/active accent variation.
- `--success`: `#17D2B9` — subtle success tone.
- `--danger`: `#FF6B6B` — alert and error tone.
- `--surface-light`: `#F4F5F7` — light mode background alternative.
- `--text-dark`: `#111827` — dark mode for light theme text.

### Semantic system
- `--bg-code`: `#0F172A` — code block background.
- `--border-muted`: `#2A3445` — subtle divider.
- `--shadow`: `rgba(0, 0, 0, 0.18)` — for cards and popovers.

## 2. Typography Scale

### Font families
- `font-sans`: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- `font-mono`: `JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

### Scale
- `xxs` / `text-2xs`: `0.75rem` / `12px`
- `xs` / `text-xs`: `0.8125rem` / `13px`
- `sm` / `text-sm`: `0.875rem` / `14px`
- `base` / `text-base`: `1rem` / `16px`
- `lg` / `text-lg`: `1.125rem` / `18px`
- `xl` / `text-xl`: `1.25rem` / `20px`
- `2xl` / `text-2xl`: `1.5rem` / `24px`
- `3xl` / `text-3xl`: `1.875rem` / `30px`
- `4xl` / `text-4xl`: `2.25rem` / `36px`
- `5xl` / `text-5xl`: `3rem` / `48px`

### Hierarchy
- Page title / hero: `5xl` → `4xl` on smaller screens
- Section titles: `3xl` / `2xl`
- Card headings: `xl`
- Body text: `base` / `lg`
- Labels / microcopy: `sm` / `xs`
- Code and metadata: `sm` with `font-mono`

### Line heights
- `leading-none`: `1`
- `leading-tight`: `1.2`
- `leading-normal`: `1.6`
- `leading-relaxed`: `1.75`

## 3. Spacing System

Adopt a 4px baseline with clear spacing increments.

- `space-1`: `0.25rem` / `4px`
- `space-2`: `0.5rem` / `8px`
- `space-3`: `0.75rem` / `12px`
- `space-4`: `1rem` / `16px`
- `space-5`: `1.25rem` / `20px`
- `space-6`: `1.5rem` / `24px`
- `space-7`: `1.75rem` / `28px`
- `space-8`: `2rem` / `32px`
- `space-10`: `2.5rem` / `40px`
- `space-12`: `3rem` / `48px`
- `space-16`: `4rem` / `64px`
- `space-20`: `5rem` / `80px`

### Layout rhythm
- Base gutter: `space-8`
- Narrow stack: `space-4`
- Section gap: `space-12`
- Page padding: `space-10` / `space-16`
- Card padding: `space-6`
- Tight grouping: `space-3`

## 4. Border Radius Standards

- `radius-none`: `0`
- `radius-sm`: `0.375rem` / `6px`
- `radius-base`: `0.5rem` / `8px`
- `radius-lg`: `0.75rem` / `12px`
- `radius-full`: `9999px`

### Usage
- Primary cards, panels: `radius-base`
- Buttons and inputs: `radius-lg`
- Small toggles / pills: `radius-full`
- Code blocks / data panels: `radius-sm`

## 5. Shadow System

Keep shadows subtle, minimal, and premium.

- `shadow-xs`: `0 1px 2px rgba(0, 0, 0, 0.06)`
- `shadow-sm`: `0 4px 12px rgba(0, 0, 0, 0.08)`
- `shadow-md`: `0 10px 30px rgba(0, 0, 0, 0.12)`
- `shadow-lg`: `0 20px 40px rgba(0, 0, 0, 0.15)`
- `shadow-glow`: `0 0 0 1px rgba(124, 97, 255, 0.12), 0 20px 60px rgba(28, 36, 63, 0.45)`

### Usage
- Surface cards: `shadow-sm`
- Elevated sections or modal surfaces: `shadow-md`
- Hover-focused cards: `shadow-lg`
- Accent glow for hero highlights: `shadow-glow`

## 6. Animation Guidelines

### Motion principles
- Minimal motion by default
- Fast, elegant interactions
- Prefer opacity and transform for smooth performance
- Avoid excessive bounce and multi-axis motion

### Timing scale
- `motion-quick`: `120ms`
- `motion-fast`: `180ms`
- `motion-medium`: `240ms`
- `motion-slow`: `320ms`
- `motion-hero`: `450ms`

### Easing
- `ease-standard`: `cubic-bezier(0.25, 0.1, 0.25, 1)`
- `ease-soft`: `cubic-bezier(0.4, 0, 0.2, 1)`
- `ease-in-out`: `cubic-bezier(0.35, 0, 0.25, 1)`

### Recommended effects
- Fade in: `opacity` + slight `translateY(8px)`
- Button hover: `transform: translateY(-1px)` + `box-shadow` lift
- Link underline transition: `width` / `opacity`
- Focus ring: subtle outline with `rgba(124, 97, 255, 0.25)`
- Active state: `scale(0.98)` for buttons

## 7. Tailwind Theme Configuration

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0D11',
        surface: '#13171F',
        surfaceMuted: '#181E27',
        border: '#2F3846',
        text: '#F8FAFC',
        textSecondary: '#BAC7D6',
        textMuted: '#7B8A9D',
        accent: '#7C61FF',
        accentHover: '#4E3CFF',
        success: '#17D2B9',
        danger: '#FF6B6B',
        code: '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1rem' }],
        xs: ['0.8125rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.5rem' }],
        base: ['1rem', { lineHeight: '1.75rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
      },
      borderRadius: {
        none: '0',
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.06)',
        sm: '0 4px 12px rgba(0, 0, 0, 0.08)',
        md: '0 10px 30px rgba(0, 0, 0, 0.12)',
        lg: '0 20px 40px rgba(0, 0, 0, 0.15)',
        glow: '0 0 0 1px rgba(124, 97, 255, 0.12), 0 20px 60px rgba(28, 36, 63, 0.45)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        120: '120ms',
        180: '180ms',
        240: '240ms',
        320: '320ms',
        450: '450ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

## 8. Implementation Notes

- Use dark color tokens as the default theme; support a light palette only for alternate layouts.
- Prefer simple, geometric spacing and minimal decorative accents.
- Keep text block layouts narrow for reading comfort; use `max-w-3xl` or `max-w-4xl` for article bodies.
- Limit the accent palette to one primary color and one supportive highlight.
- Use animation only for interaction feedback and small entrance transitions.
