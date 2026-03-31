# Design System Document: High-End Editorial Aesthetic
> **Source:** Google Stitch — Project EDS-XWALK-AI | Design System: Metallo Noir  
> **Last synced:** 2026-03-31

## 1. Overview & Creative North Star
**The Creative North Star: "The Culinary Curator"**

This design system is engineered to evoke the precision of professional-grade appliances and the warmth of a luxury home. We are moving away from the "generic SaaS" look of rounded cards and heavy borders. Instead, we embrace a **High-End Editorial** approach—think of a bespoke architectural digest where the white space is as intentional as the content.

The system breaks the "template" look through **intentional asymmetry** and **tonal layering**. We treat the screen not as a flat canvas, but as a physical space composed of brushed metals, fine silks, and frosted glass. Our goal is to create an atmosphere of "Quiet Luxury," where the interface recedes to let high-quality product imagery take center stage.

---

## 2. Colors & Tonal Palette
The palette is rooted in deep charcoals, warm ochre accents, and metallic neutrals. It mimics the materials found in a luxury kitchen: stainless steel, dark oak, and honed stone.

### Color Strategy
- **Primary (`#5c5c5c`):** Used for structural authority. It represents the "brushed steel" essence of the brand.
- **Secondary (`#7d563b`):** This is our "signature" warmth. Use it sparingly for key call-to-actions (CTAs) to provide a rich, leathery contrast to the cooler grays.
- **Neutral Surface Hierarchy:** Use the `surface-container` tiers to define depth.
    - `surface-container-lowest` (#ffffff) for primary content cards.
    - `surface` (#fbf9f8) for the main background.
    - `surface-container-high` (#eae8e7) for recessed sidebars or subtle footers.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. A `surface-container-low` section sitting against a `surface` background provides all the separation a premium user needs.

### Glass & Gradient Rule
To achieve a "signature" feel, floating elements (like navigation bars or hovering detail cards) should use **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-filter: blur(20px)`.
*Pro Tip:* Use a subtle linear gradient on main CTAs transitioning from `secondary` to `secondary_container` (#fecaa8) at a 45-degree angle to give the button a "light-catching" metallic sheen.

---

## 3. Typography
We utilize a sophisticated pairing of **Manrope** (Display/Headlines) and **Inter** (Body/Labels) to convey modern elegance.

- **Display (Manrope):** Massive, airy, and commanding. Use `display-lg` (3.5rem) with wide letter-spacing (-0.02em) for hero headers. This mimics high-end editorial mastheads.
- **Headlines (Manrope):** Use `headline-md` (1.75rem) for section titles. These should be set in a medium weight to feel architectural and stable.
- **Body (Inter):** High legibility. Use `body-lg` (1rem) for descriptions. Ensure a generous line-height (1.6) to maintain the "breathable" feel of the brand.
- **Labels (Inter):** Small, often all-caps with increased letter-spacing (0.1em) to denote "Spec Sheets" or "Technical Details."

The typography hierarchy is designed to guide the eye like a gallery exhibition—clear, authoritative, and never crowded.

---

## 4. Elevation & Depth
In this design system, depth is achieved through **Tonal Layering** rather than traditional drop shadows.

- **The Layering Principle:** Stack surfaces like sheets of fine paper. Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift that feels integrated into the UI.
- **Ambient Shadows:** If an element must "float" (e.g., a modal), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(27, 28, 28, 0.04)`. The shadow color is a tinted version of `on-surface` at a very low opacity to mimic natural ambient light.
- **The Ghost Border:** If a border is required for accessibility, use the `outline-variant` token at **20% opacity**. Never use 100% opaque borders; they shatter the "minimalist" illusion.

---

## 5. Components

### Buttons
- **Primary:** `secondary` (#7d563b) background with `on-secondary` (#ffffff) text. Use `md` (0.375rem) corner radius for a sharp, tailored look.
- **Secondary:** Transparent background with a "Ghost Border" and `on-background` text.
- **Tertiary:** Pure text with a 1px underline using the `secondary` color, spaced 4px below the baseline.

### Cards & Lists
**Strict Rule:** Forbid the use of divider lines.
- Separate list items using vertical white space (use `spacing-6` or `spacing-8`).
- For cards, utilize the background shifts described in the Layering Principle. A card should feel like a "zone" rather than a "box."

### Input Fields
- Avoid fully enclosed boxes. Use a "Minimalist Underline" or a very subtle `surface-container` background.
- Labels should use `label-md` and be positioned above the field with generous padding (`spacing-2`).

### High-End Detail Chips
- Use `surface-container-highest` for the chip background with `on-surface-variant` text. These should be perfectly rectangular (radius: `none`) to mimic metal industrial tags.

---

## 6. Do's and Don'ts

### Do:
- **Use Intentional Asymmetry:** Align text to the left while keeping imagery off-center to create a dynamic, editorial feel.
- **Embrace Whitespace:** If a section feels "empty," it's likely working. Whitespace in this system signifies luxury and "room to breathe."
- **Use High-Contrast Imagery:** Only use professional, high-resolution photography with deep blacks and sharp highlights.

### Don't:
- **Don't use "System" Shadows:** Avoid the default CSS `box-shadow` values. They look cheap and digital.
- **Don't use Dividers:** Never use `<hr>` tags or 1px solid gray lines to separate content. Use the spacing scale (`spacing-12` or `spacing-16`) to create mental breaks.
- **Don't use Pure Black:** Use `on-background` (#1b1c1c) for text. Pure `#000000` is too harsh for the sophisticated tonal transitions of this system.

### Accessibility Note
While we prioritize aesthetics, legibility is paramount. Always ensure that `on-surface` text against `surface` containers maintains a contrast ratio of at least 4.5:1. Use the `secondary` accent only for interactive elements, never for long-form body text.

---

## 7. Design Tokens Reference

All tokens are available as CSS custom properties in `styles/tokens.css`. Use them via `var(--token-name)`.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#5c5c5c` | Structural authority, brushed steel |
| `--color-secondary` | `#7d563b` | CTAs, warm accents |
| `--color-background` | `#fbf9f8` | Main background |
| `--color-surface` | `#fbf9f8` | Surface base |
| `--color-surface-lowest` | `#ffffff` | Content cards |
| `--color-surface-low` | `#f5f3f3` | Subtle backgrounds |
| `--color-surface-container` | `#f0eded` | Containers |
| `--color-surface-high` | `#eae8e7` | Sidebars, footers |
| `--color-surface-highest` | `#e4e2e2` | Chips, tags |
| `--color-on-background` | `#1b1c1c` | Body text |
| `--color-on-surface` | `#1b1c1c` | Surface text |
| `--color-outline` | `#83746c` | Ghost borders |
| `--color-outline-variant` | `#d5c3ba` | Subtle dividers (20% opacity only) |
| `--color-error` | `#ba1a1a` | Error states |
| `--font-display` | `'Manrope', sans-serif` | Headlines, display text |
| `--font-body` | `'Inter', sans-serif` | Body, labels |
