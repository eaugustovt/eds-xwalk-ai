# Copilot Instructions

This is an AEM Edge Delivery Services project using the **xwalk/Universal Editor** authoring model.

## Project Type

- **xwalk (Universal Editor)** — NOT document-based authoring
- The content contract is defined by JSON component models (`blocks/{name}/_{name}.json`)
- The Universal Editor generates HTML from these models — developers decorate the output

## Architecture

- Vanilla JavaScript (ES6+), no build steps, no frameworks
- CSS3 mobile-first, no Tailwind or CSS frameworks
- Blocks: `blocks/{name}/{name}.js` + `{name}.css` + `_{name}.json`
- Models merged via `npm run build:json` into root `component-*.json` files

## Key Patterns

### Block JS Decoration
```javascript
// CSS-first approach — many blocks need NO JS (hero.js is empty)
export default function decorate(block) {
  // Only add JS when CSS can't achieve the layout
}
```

### When Restructuring DOM — ALWAYS use moveInstrumentation()
```javascript
import { moveInstrumentation } from '../../scripts/scripts.js';

// Preserves data-aue-* attributes for UE editability
moveInstrumentation(originalElement, newElement);
```

### Block Model JSON (`_block.json`)
```json
{
  "definitions": [{ "title": "Block", "id": "block", "plugins": { "xwalk": { "page": { "resourceType": "core/franklin/components/block/v1/block", "template": { "name": "Block", "model": "block" }}}}}],
  "models": [{ "id": "block", "fields": [...] }],
  "filters": []
}
```

### CSS Scoping
```css
/* ALL selectors scoped to block name */
.block-name { }
.block-name h2 { }
/* Use :first-child/:nth-child to target UE rows/columns */
.block-name > div:first-child { }
```

## Code Style

- ESLint: Airbnb + xwalk plugin
- Stylelint: standard config
- Unix line endings (LF) — enforced by `.gitattributes`
- `.js` extensions required in imports
- Indent: 2 spaces (JS/JSON), 4 spaces (CSS)

## eslint-plugin-xwalk Rules (Component Models)

All rules are **errors** — violations fail CI. Applied to generated `component-*.json` files.

### Max 4 cells per block (`xwalk/max-cells`)
- Each field = 1 cell, but **collapsible pairs** count as 1:
  - `{name}` + `{name}Alt` (e.g., `image` + `imageAlt`)
  - `{name}` + `{name}Text` (e.g., `link` + `linkText`)
  - `{name}` + `{name}Title`, `{name}Type`, `{name}MimeType`
- Fields with `_` prefix groups count as 1 (e.g., `item_1`, `item_2`)

### No orphan collapsible fields (`xwalk/no-orphan-collapsible-fields`)
- Suffix fields (`imageAlt`, `linkText`, etc.) require their base field (`image`, `link`)
- **Wrong:** `ctaText` without `cta` → use `link` + `linkText` instead

### Field naming (`xwalk/invalid-field-name`)
- Start with letter, allow `a-zA-Z0-9_-:`, max one `_`, max one `:`

### No duplicates (`xwalk/no-duplicate-fields`)

### Approved resource types only (`xwalk/no-custom-resource-types`)
- Must start with `core/franklin/components/`, `fd/franklin/components/`, or `core/fd/components/form/`

### Standard naming conventions for collapsible pairs
| Content | Fields | Components |
|---------|--------|------------|
| Image | `image` + `imageAlt` | `reference` + `text` |
| Link/CTA | `link` + `linkText` | `aem-content` + `text` |
| Video | `video` + `videoAlt` | `reference` + `text` |

## Important Files

- `scripts/aem.js` — NEVER modify
- `scripts/scripts.js` — `moveInstrumentation()` lives here
- `models/_section.json` — Register new blocks in section filter
- `component-*.json` — Generated, DO NOT edit directly

## Commands

- `npm run build:json` — Merge model JSONs
- `npm run lint` / `npm run lint:fix` — Lint all
- `aem up --no-open` — Start dev server

## Reference Sources

When implementing something new, consult these references:

### Repositories
- [adobe-rnd/aem-boilerplate-xwalk](https://github.com/adobe-rnd/aem-boilerplate-xwalk) — xwalk boilerplate (this project's base)
- [adobe/aem-block-collection](https://github.com/adobe/aem-block-collection) — Official block library (accordion, carousel, modal, tabs, etc.)
- [adobe/helix-website](https://github.com/adobe/helix-website) — Adobe's own EDS site
- [adobe/skills](https://github.com/adobe/skills) — Adobe EDS skills

### Documentation
- [UE Developer Tutorial](https://www.aem.live/developer/ue-tutorial) — Primary xwalk/UE guide
- [Developer Tutorial](https://www.aem.live/developer/tutorial) — General EDS tutorial
- [Content Modelling (UE)](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
- [Creating Blocks (UE)](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block)
