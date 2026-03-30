# Fastbreak Design System

> Practical reference for developers. See the live component showcase at `/design` (dev only).

---

## Design Direction

**Energetic · Sporty · Bold**

Fastbreak is a sports event dashboard. The UI should feel like a sports broadcast or a match-day programme — alive, confident, and high-contrast. It is not a generic SaaS product.

**Anti-references:** Default shadcn grey dashboards, flat enterprise tools, muted palettes.  
**References:** ESPN, Sofascore, Formula 1 website — bold type, vivid colour blocks, sport-specific colour coding.

---

## Color System

### Why OKLCH over HSL

OKLCH (Oklab lightness–chroma–hue) is a perceptually uniform colour space. This means:

- **Equal lightness = equal perceived brightness.** Two colours at `oklch(52% ...)` look equally bright to the human eye, regardless of hue. HSL has no such guarantee — a green at `hsl(120 80% 50%)` looks far brighter than a red at the same lightness.
- **Predictable colour manipulation.** Lightening or darkening a token shifts it consistently, making dark-mode variants easier to reason about.
- **Better gamut support.** OKLCH can address wide-gamut P3 colours that HSL cannot express, ready for modern displays.

### Key Tokens

All tokens are defined as CSS custom properties in `app/globals.css`.

| Token | Light value | Dark value | Purpose |
|---|---|---|---|
| `--primary` | `oklch(52% 0.22 25)` | `oklch(60% 0.22 25)` | Sport red — CTAs, active states, brand moments |
| `--primary-foreground` | `oklch(98.5% 0.004 25)` | `oklch(98% 0.004 25)` | Text on primary |
| `--destructive` | `oklch(44% 0.18 13)` | `oklch(48% 0.18 13)` | Error / delete actions — visually distinct from primary red (cooler hue 13 vs 25) |
| `--background` | `oklch(98.5% 0.004 25)` | `oklch(13% 0.012 25)` | Page background — warm-tinted neutral |
| `--card` | `oklch(100% 0 0)` | `oklch(17% 0.012 25)` | Card / surface |
| `--secondary` | `oklch(94% 0.008 25)` | `oklch(22% 0.01 25)` | Secondary buttons, secondary surfaces |
| `--muted` | `oklch(94% 0.008 25)` | `oklch(22% 0.01 25)` | Muted backgrounds |
| `--muted-foreground` | `oklch(50% 0.008 25)` | `oklch(62% 0.008 25)` | Subdued labels, metadata |
| `--border` | `oklch(89% 0.006 25)` | `oklch(22% 0.01 25)` | Borders, dividers |
| `--nav-bg` | `oklch(10% 0.014 25)` | `oklch(10% 0.014 25)` | Nav bar — always dark |
| `--nav-border` | `oklch(18% 0.012 25)` | `oklch(18% 0.012 25)` | Nav bar bottom border |

### Warm-tinted Neutrals

Every neutral uses hue **25** (red-orange) with very low chroma. This keeps greys feeling warm and brand-consistent rather than cold or blue-shifted.

### Primary Red is Not Destructive Red

`--primary` (hue 25) is sport red — high energy, brand colour, used for CTAs.  
`--destructive` (hue 13) is a cooler crimson, visually distinct from primary. The difference prevents users from reading delete buttons as CTAs.

---

## Typography

### Fonts

| Role | Font | CSS class |
|---|---|---|
| Headings | **Barlow Condensed** | `font-heading` |
| Body / UI | **Barlow** | `font-sans` (default) |

Both fonts are loaded via `next/font/google` in the root layout and exposed as CSS variables (`--font-heading`, `--font-sans`), then wired into Tailwind config.

### Why Barlow

- **Barlow Condensed** is a condensed grotesque with a strong sports-broadcast character. Used at large sizes in uppercase with wide tracking, it reads as bold and authoritative without being decorative.
- **Barlow** (the regular-width variant) is used for body copy and UI text, keeping the type family consistent while staying readable at small sizes.
- The pairing avoids the "default Geist/Inter SaaS" look while maintaining legibility.

### Usage Rules

- Headings: `font-heading uppercase tracking-wide` — always uppercase in display contexts.
- Body: default `font-sans`, no uppercase.
- Muted metadata: `text-sm text-muted-foreground`.

---

## Border Radius

**`--radius: 0.375rem`** (6px)

This is `rounded-md` in Tailwind. Chosen because:
- Rounds sharp corners enough to feel modern and friendly.
- Avoids the pill-rounded look (`rounded-full` everywhere) that would undercut the bold, sporty aesthetic.
- Consistent across cards, inputs, badges, and buttons.

---

## Nav Bar

The nav bar is **always dark** (`var(--nav-bg)` = `oklch(10% 0.014 25)`), regardless of light/dark mode. This is intentional:

- Provides a strong frame for the content area.
- Dark nav with red accents reads as a sports brand header (ESPN, Sky Sports pattern).
- Avoids the nav inverting unexpectedly when users toggle dark mode.

A **red stripe** (`bg-primary h-0.5`) sits at the bottom of the nav as a brand-identity mark — a nod to sports broadcast lower-thirds.

---

## Sport Badge Color System

Sport badges use saturated, sport-specific Tailwind colors. Each badge has light-mode and dark-mode variants.

| Sport | Light classes | Dark classes |
|---|---|---|
| Soccer | `bg-emerald-100 text-emerald-800` | `dark:bg-emerald-950 dark:text-emerald-300` |
| Basketball | `bg-orange-100 text-orange-800` | `dark:bg-orange-950 dark:text-orange-300` |
| Tennis | `bg-lime-100 text-lime-800` | `dark:bg-lime-950 dark:text-lime-300` |
| Baseball | `bg-amber-100 text-amber-800` | `dark:bg-amber-950 dark:text-amber-300` |
| Volleyball | `bg-sky-100 text-sky-800` | `dark:bg-sky-950 dark:text-sky-300` |
| Rugby | `bg-stone-100 text-stone-700` | `dark:bg-stone-800 dark:text-stone-300` |
| Hockey | `bg-cyan-100 text-cyan-800` | `dark:bg-cyan-950 dark:text-cyan-300` |
| American Football | `bg-violet-100 text-violet-800` | `dark:bg-violet-950 dark:text-violet-300` |

Colors are defined in `components/events/sport-badge.tsx` as a `SPORT_COLORS` record keyed on `SportType`.

**Design intent:** Each sport gets a distinct, saturated hue — readable at a glance, never washed out. This is a feature of the UI, not decoration.

---

## Design Principles

1. **Energy first** — every screen should feel dynamic. Use bold headings, vivid colour, confident spacing. Avoid timid neutrals as the dominant tone.
2. **Sport-native** — the sport badge colour system is a feature. Colours should be saturated and distinct.
3. **Mobile-ready by default** — touch targets minimum 44px, type readable at arm's length, cards stack naturally. Design mobile-first.
4. **Hierarchy through contrast** — size, weight, and colour create visual priority. Event name, sport, and date should be scannable in under a second.
5. **Red is intentional** — primary red is reserved for brand moments and CTAs. Never use it for errors (use `--destructive`).

---

## How to Extend

### Adding a New Color Token

1. Add the CSS variable to both `:root` and `.dark` in `app/globals.css`:
   ```css
   --my-token: oklch(55% 0.15 200);
   ```
2. Reference it in Tailwind via `tailwind.config.ts` if you need a utility class:
   ```ts
   colors: {
     "my-token": "var(--my-token)",
   }
   ```
3. Use inline `style={{ color: 'var(--my-token)' }}` or a custom class for one-off use.

### Adding a New Sport Type

1. Add the sport name to the `SPORT_TYPES` array in `lib/schemas/event.ts`.
2. Add a corresponding entry to `SPORT_COLORS` in `components/events/sport-badge.tsx`, following the `bg-{color}-100 text-{color}-800 dark:bg-{color}-950 dark:text-{color}-300` pattern.
3. Add a DB migration if `sport_type` is constrained as an enum in Postgres.

### Adding a New Font

1. Import from `next/font/google` in `app/layout.tsx`.
2. Assign a CSS variable: `variable: '--font-display'`.
3. Add to `tailwind.config.ts` under `theme.extend.fontFamily`.
4. Use with the generated Tailwind class (e.g., `font-display`).

### Adding a New Component

Follow shadcn/ui conventions:
```bash
npx shadcn@latest add <component>
```
The component lands in `components/ui/`. Customise it there — do not edit the shadcn source in `node_modules`.

Add new showcase variants to `app/(protected)/design/page.tsx` so the design reference stays current.
