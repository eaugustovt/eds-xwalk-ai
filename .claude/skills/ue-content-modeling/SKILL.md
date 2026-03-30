---
name: ue-content-modeling
description: Create component models for AEM Edge Delivery Services blocks using the Universal Editor (xwalk). Defines the JSON contract (component-definition, component-models, component-filters) that drives HTML generation. Use this skill when creating or modifying blocks in xwalk/UE projects.
---

# UE Content Modeling for AEM Edge Delivery Blocks (xwalk)

This skill guides you through designing **Universal Editor component models** for AEM Edge Delivery Services blocks. In xwalk projects, the JSON model IS the content contract — it defines what fields authors see in the UE properties panel, and the platform generates HTML from it.

## Key Difference from Document-Based

In document-based projects, the content model is a **table structure** (rows/columns) that authors create in Google Docs or SharePoint. In xwalk/UE, the content model is a **JSON definition** (`_block.json`) with typed fields that the Universal Editor renders as a form.

| Aspect | Document-Based | xwalk/UE |
|--------|---------------|----------|
| Contract | Table structure | `_block.json` (JSON model) |
| Author interface | Doc/Sheet table | UE properties panel |
| HTML generation | Backend parses table | Backend renders from model fields |
| Field types | Implicit (formatting) | Explicit (text, richtext, reference, select, etc.) |

## Related Skills

- **ue-content-driven-development**: This skill is invoked FROM the UE-CDD skill during the Model phase
- **ue-building-blocks**: After content modeling, this skill handles decoration implementation
- **block-collection-and-party**: Use to find similar blocks and their models for reference

## When to Use

- Creating new blocks (invoked by ue-content-driven-development)
- Modifying existing block models (adding/changing fields)
- User explicitly asks about UE component modeling

## JSON Model Structure

Every block model file (`blocks/{name}/_{name}.json`) has three sections:

### 1. Definitions — What the block IS

```json
{
  "definitions": [
    {
      "title": "Banner",
      "id": "banner",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "Banner",
              "model": "banner"
            }
          }
        }
      }
    }
  ]
}
```

Key fields:
- `title`: Display name in the UE component picker
- `id`: Unique identifier (lowercase, used in filters)
- `resourceType`: Always `core/franklin/components/block/v1/block` for standard blocks. Exception: structural blocks like columns use `core/franklin/components/columns/v1/columns`
- `template.name`: Block name as it appears in the HTML (PascalCase)
- `template.model`: References the model ID from the models section

### 2. Models — What fields the author fills in

```json
{
  "models": [
    {
      "id": "banner",
      "fields": [
        {
          "component": "reference",
          "valueType": "string",
          "name": "image",
          "label": "Image",
          "multi": false
        },
        {
          "component": "text",
          "valueType": "string",
          "name": "imageAlt",
          "label": "Alt Text",
          "value": ""
        },
        {
          "component": "richtext",
          "name": "text",
          "value": "",
          "label": "Content",
          "valueType": "string"
        }
      ]
    }
  ]
}
```

### 3. Filters — What can be nested inside

```json
{
  "filters": []
}
```

Use filters for **collection blocks** (like Cards) where items are added inside the block:

```json
{
  "filters": [
    {
      "id": "cards",
      "components": ["card"]
    }
  ]
}
```

## Available Field Components

| Component | Use For | Notes |
|-----------|---------|-------|
| `text` | Short text, numbers | Set `valueType` to `string` or `number` |
| `richtext` | Formatted content (headings, paragraphs, links, bold, etc.) | Renders as HTML |
| `reference` | Images, asset references | Set `multi: false` for single |
| `aem-content` | Links to AEM pages/content | For internal references |
| `select` | Dropdown single choice | Provide `options` array |
| `multiselect` | Multiple choice | Provide `options` array |
| `boolean` | Toggle on/off | For feature flags |
| `number` | Numeric values | Use when numbers need validation |
| `date` | Date picker | ISO date format |

## Block Patterns

### Standalone Block (Hero, Banner, Quote)

Single block with direct fields — no nested items.

```json
{
  "definitions": [{ "title": "Banner", "id": "banner", "plugins": { "xwalk": { "page": { "resourceType": "core/franklin/components/block/v1/block", "template": { "name": "Banner", "model": "banner" }}}}}],
  "models": [{ "id": "banner", "fields": [...] }],
  "filters": []
}
```

### Collection Block (Cards, Carousel)

Parent block + child item definitions. The parent has a **filter** that allows specific child components.

```json
{
  "definitions": [
    {
      "title": "Cards", "id": "cards",
      "plugins": { "xwalk": { "page": { "resourceType": "core/franklin/components/block/v1/block", "template": { "name": "Cards", "filter": "cards" }}}}
    },
    {
      "title": "Card", "id": "card",
      "plugins": { "xwalk": { "page": { "resourceType": "core/franklin/components/block/v1/block/item", "template": { "name": "Card", "model": "card" }}}}
    }
  ],
  "models": [{ "id": "card", "fields": [...] }],
  "filters": [{ "id": "cards", "components": ["card"] }]
}
```

Note: Parent uses `filter` (not `model`), child uses `resourceType` ending in `/item`.

## Step-by-Step Workflow

### Step 1: Understand Content Requirements

Ask these questions:
- What is the block's purpose?
- What content elements are needed? (images, text, headings, links, etc.)
- Is this a standalone block or a collection (repeating items)?
- Does the block need variants/styles?

### Step 2: Design the Model

1. **Choose the pattern**: Standalone or Collection
2. **Define fields**: Map each content element to a field component
3. **Name fields consistently**: Follow existing conventions in the project
   - `image` + `imageAlt` for images (reference + text)
   - `text` for rich content (richtext)
   - `link` + `linkText` for CTAs (aem-content + text)
   - `style` for variant selection (multiselect)

### Step 3: Validate

Checklist:
- [ ] `id` is unique across all blocks
- [ ] `template.name` matches the block directory name (PascalCase)
- [ ] `template.model` references a valid model ID
- [ ] All field `name` values are unique within the model
- [ ] Field `component` types match the content type
- [ ] Collection blocks have both parent/child definitions and a filter
- [ ] Standalone blocks have `filters: []`

### Step 4: Create the JSON File

Create `blocks/{block-name}/_{block-name}.json` with all three sections.

**After completing the model design, return control to the calling skill (ue-content-driven-development) which handles the remaining steps: section filter registration, build:json, lint, and PR.**

## Common Anti-Patterns

- **Too many fields**: Keep it simple — fewer fields = better author experience
- **Using `text` for rich content**: Use `richtext` when authors need formatting
- **Missing `imageAlt`**: Always pair `reference` image fields with an alt text field
- **Hardcoding values**: Use `select`/`multiselect` for predefined options
- **Forgetting section filter**: Block won't appear in UE unless added to section filter
- **Forgetting `build:json`**: Changes to `_*.json` files aren't reflected until merged

## Resources

Reference existing blocks in this project for patterns:
- `blocks/hero/_hero.json` — Standalone block (image + richtext)
- `blocks/cards/_cards.json` — Collection block (parent + child + filter)
- `blocks/columns/_columns.json` — Structural block (config + nested filter)
- `blocks/fragment/_fragment.json` — Single-field block (aem-content reference)
- `models/_section.json` — Section model with style multiselect and component filter
