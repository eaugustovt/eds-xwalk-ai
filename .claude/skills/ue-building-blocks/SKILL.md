---
name: ue-building-blocks
description: Guide for implementing block decoration (JS/CSS) in AEM Edge Delivery Services xwalk/UE projects. Handles CSS-first styling and minimal JS decoration of UE-generated HTML. Use this skill for all implementation work in the Build phase of ue-content-driven-development.
---

# UE Building Blocks (xwalk)

This skill guides you through implementing the **decoration layer** (JS/CSS) for AEM Edge Delivery blocks in xwalk/Universal Editor projects. In xwalk, the UE generates the HTML from the component model — your code decorates that output.

## Key Difference from Document-Based

In document-based projects, JS must transform table-based HTML into a rich DOM structure. In xwalk, the UE generates well-structured HTML from model fields, so decoration is often **CSS-first with minimal or no JS**.

| Aspect | Document-Based | xwalk/UE |
|--------|---------------|----------|
| HTML source | Table rows/columns | UE-generated from model fields |
| JS role | Heavy DOM transformation | Minimal decoration, sometimes none |
| CSS role | Style the transformed DOM | Style the UE-generated DOM directly |
| DOM restructuring | Common and expected | Avoid when possible; use `moveInstrumentation()` if needed |
| Empty JS file | Unusual | Valid pattern (hero.js is empty!) |

## Related Skills

- **ue-content-driven-development**: This skill is invoked FROM the UE-CDD Build phase
- **ue-content-modeling**: Defines the model that generates the HTML you decorate
- **block-collection-and-party**: Find reference implementations
- **testing-blocks**: Invoked after implementation for validation

## Prerequisites

Before using this skill, you must have:
- The `.plain.html` output from the UE preview (from ue-content-driven-development Build phase)
- Understanding of the block's model fields (from ue-content-modeling)
- The block directory already exists with `_{block}.json`

## Implementation Workflow

- [ ] Step 1: Analyze UE-generated HTML
- [ ] Step 2: Decide JS necessity
- [ ] Step 3: Implement CSS
- [ ] Step 4: Implement JS (if needed)
- [ ] Step 5: Test

## Step 1: Analyze UE-Generated HTML

The HTML from the UE follows a predictable structure. Fetch it from preview:

```bash
curl https://main--{repo}--{owner}.aem.page/{path}.plain.html
```

### Understanding UE HTML Structure

The UE generates HTML with `data-aue-*` attributes for editability. The general pattern:

**Standalone block (e.g., hero with image + richtext):**
```html
<div class="hero">
  <div>
    <div>
      <picture>...</picture>
    </div>
  </div>
  <div>
    <div>
      <h1>Heading</h1>
      <p>Description text</p>
    </div>
  </div>
</div>
```

**Collection block (e.g., cards with multiple items):**
```html
<div class="cards">
  <div>
    <div><picture>...</picture></div>
    <div><p>Card 1 text</p></div>
  </div>
  <div>
    <div><picture>...</picture></div>
    <div><p>Card 2 text</p></div>
  </div>
</div>
```

Key observations:
- Block rows = direct children `<div>` elements
- Each row's columns = nested `<div>` elements
- `picture` elements for images
- Rich text rendered as standard HTML (h1-h6, p, a, strong, em, etc.)
- `data-aue-*` / `data-richtext-*` attributes for UE editability

## Step 2: Decide JS Necessity

**No JS needed when:**
- CSS alone can achieve the desired layout (flexbox, grid, positioning)
- No DOM restructuring required
- No dynamic behavior (carousels, tabs, etc.)
- Example: **hero** block — CSS positions picture absolutely behind text

**Minimal JS needed when:**
- Adding CSS classes for styling hooks
- Minor DOM adjustments (wrapping elements, adding containers)
- Optimizing images with `createOptimizedPicture()`

**Full JS needed when:**
- Significant DOM restructuring (collection blocks like cards → ul/li)
- Dynamic behavior (carousels, accordions, tabs)
- Fetching external data
- Event handling

### Decision Matrix

```
UE HTML → CSS can style directly?
  ├─ YES → CSS only, empty or no JS file
  └─ NO → Need DOM changes?
       ├─ Minor (add classes, wrap) → Minimal JS
       └─ Major (restructure) → Full JS with moveInstrumentation()
```

## Step 3: Implement CSS

**Essential: CSS-first approach.** Start with CSS and add JS only when CSS falls short.

### File: `blocks/{block-name}/{block-name}.css`

```css
/* Container and wrapper overrides (if full-width needed) */
.{block-name}-container .{block-name}-wrapper {
  max-width: unset;
  padding: 0;
}

/* Block-level styles - mobile first */
.{block-name} {
  position: relative;
}

/* Target UE-generated elements directly */
.{block-name} picture {
  /* Style the picture element from the model's image field */
}

.{block-name} h1,
.{block-name} h2 {
  /* Style headings from richtext fields */
}

.{block-name} p {
  /* Style paragraphs from richtext fields */
}

.{block-name} .button-container {
  /* Style CTA buttons */
}

/* Responsive breakpoints */
@media (width >= 600px) {
  .{block-name} { /* tablet */ }
}

@media (width >= 900px) {
  .{block-name} { /* desktop */ }
}
```

### Key CSS Patterns for xwalk

**Background image overlay (hero/banner pattern):**
```css
.banner {
  position: relative;
  min-height: 400px;
}

.banner > div:first-child {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.banner picture, .banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner > div:last-child {
  position: relative;
  z-index: 1;
  padding: 40px 24px;
}
```

**Use nth-child/first-child/last-child** to target UE rows and columns without needing JS to add classes:
```css
.myblock > div:first-child { /* first row */ }
.myblock > div:last-child { /* last row */ }
.myblock > div > div:first-child { /* first column of each row */ }
```

### CSS Custom Properties

Use existing custom properties from `styles/styles.css`:
```css
var(--background-color)
var(--text-color)
var(--link-color)
var(--heading-font-family)
var(--body-font-family)
```

## Step 4: Implement JS (If Needed)

### File: `blocks/{block-name}/{block-name}.js`

**If no JS needed:** Leave the file empty or don't create it. The platform handles blocks without JS gracefully.

**If minimal JS needed:**
```javascript
export default function decorate(block) {
  // Add semantic classes for CSS hooks
  const rows = [...block.children];
  if (rows[0]?.querySelector('picture')) {
    rows[0].classList.add('{block-name}-image');
  }
  if (rows[1]) {
    rows[1].classList.add('{block-name}-content');
  }
}
```

**If DOM restructuring needed — ALWAYS use `moveInstrumentation()`:**
```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);  // CRITICAL: preserve UE editability
    while (row.firstElementChild) li.append(row.firstElementChild);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
```

### Critical: `moveInstrumentation()`

When restructuring DOM, `data-aue-*` attributes on the original elements enable UE editing. If you move or replace elements without preserving these attributes, **editing breaks in the Universal Editor**.

```javascript
import { moveInstrumentation } from '../../scripts/scripts.js';

// When replacing an element
moveInstrumentation(originalElement, newElement);

// When replacing images with optimized versions
const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
moveInstrumentation(img, optimizedPic.querySelector('img'));
img.closest('picture').replaceWith(optimizedPic);
```

## Step 5: Test

1. **Lint:**
   ```bash
   npm run lint
   ```

2. **Visual validation:**
   - Check the block renders correctly in the preview environment
   - Test responsive behavior (mobile, tablet, desktop)
   - Verify no console errors

3. **UE editability (if JS restructures DOM):**
   - Verify the block is still editable in the Universal Editor
   - Check that clicking elements opens the correct property panel

## Reference Implementations

From this project:

| Block | JS | CSS | Pattern |
|-------|-----|-----|---------|
| `hero` | Empty (no JS) | Background image + overlay text | CSS-only standalone |
| `cards` | Full (ul/li restructure, optimized images) | Card grid layout | JS collection with `moveInstrumentation()` |
| `columns` | Minimal (class assignment) | Column layout | Structural block |

## Common Anti-Patterns

- **Heavy JS when CSS suffices**: Check if CSS selectors (`:first-child`, `:nth-child`) can target elements before writing JS
- **Forgetting `moveInstrumentation()`**: DOM restructuring without it breaks UE editing
- **Assuming table structure**: xwalk HTML is NOT the same as document-based table HTML
- **Inline styles**: Use CSS classes and custom properties instead
- **Non-scoped selectors**: ALL selectors must be scoped to `.{block-name}`
