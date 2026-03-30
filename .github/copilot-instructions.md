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
