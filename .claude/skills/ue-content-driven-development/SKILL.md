---
name: ue-content-driven-development
description: Apply a Content Driven Development process for AEM Edge Delivery Services xwalk/Universal Editor projects. Orchestrates a two-phase workflow — Model phase (JSON contract + PR) then Build phase (JS/CSS decoration from UE-generated HTML). Use for ALL code changes in xwalk/UE projects.
---

# UE Content Driven Development (xwalk)

You are an orchestrator of the Content Driven Development workflow for AEM Edge Delivery Services **xwalk/Universal Editor** projects. This workflow addresses the fundamental chicken-and-egg problem of UE development: you can't decorate HTML that doesn't exist yet, and the HTML only exists when the model is deployed and an author creates content.

## Key Difference from Document-Based CDD

In document-based EDS, the developer defines the table structure (content model) and writes JS to transform it — all locally, in one pass. In xwalk/UE:

1. **The JSON model IS the contract** — it defines what fields authors see in the UE
2. **The platform generates HTML** from the model — the developer doesn't control input structure
3. **Two PRs are needed** — one for the model, one for the decoration

| Aspect | Document-Based CDD | xwalk/UE CDD |
|--------|-------------------|--------------|
| Content model | Table structure (rows/cols) | `_block.json` (typed fields) |
| Test content | Local `drafts/tmp/*.plain.html` | UE-authored content on preview |
| HTML source | Developer controls via table | Platform generates from model |
| Workflow | Single PR (model + code) | Two phases: Model PR → Build PR |
| Decoration | JS transforms table → DOM | CSS-first, minimal JS |

## When to Use

Use this skill for ALL xwalk/UE development tasks:
- Creating new blocks
- Modifying existing block models
- Adding fields to existing blocks
- Implementing/changing block decoration (JS/CSS)
- Bug fixes that involve block behavior

Do NOT use for:
- Documentation-only changes
- Changes to `scripts.js`, `delayed.js`, global styles (use building-blocks skill directly)
- Configuration changes unrelated to authoring

## Two-Phase Workflow

```
┌─────────────────────────────────────────────────────────┐
│ PHASE 1: MODEL                                          │
│                                                         │
│  Define JSON model → build:json → lint → PR → main      │
│                              ↓                          │
│              Author creates content in UE               │
│                              ↓                          │
│              HTML generated on preview                  │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│ PHASE 2: BUILD                                          │
│                                                         │
│  Fetch .plain.html → CSS/JS decoration → lint → PR      │
│                                                         │
│  Validate on feature branch preview                     │
└─────────────────────────────────────────────────────────┘
```

## Phase Detection

Before starting, determine which phase:

**Start with Phase 1 (Model) when:**
- Creating a brand new block
- The block's `_{name}.json` doesn't exist yet
- Adding/changing fields in an existing model

**Start with Phase 2 (Build) when:**
- Model already exists and is deployed to main
- Content already created in UE and visible on preview
- Only changing JS/CSS decoration (no model changes)
- User provides a preview URL with existing content

**Both phases when:**
- Creating a completely new block from scratch (Model first, then Build)

---

## Phase 1: MODEL

### Step 0: Create Todo List

Create a todo list with these tasks:

1. **Analyze requirements** — Understand what the block needs
2. **Design model** — Define fields and structure
3. **Create model JSON** — Write `_{block}.json`
4. **Register in section filter** — Add to `models/_section.json`
5. **Build & validate JSON** — Run `npm run build:json`, verify output
6. **Lint** — Run `npm run lint`
7. **Ship model PR** — Create PR to main with the model

---

### Step 1: Analyze Requirements

Understand what the block needs to accomplish:
- What is the block's purpose?
- What content elements does it need? (images, text, headings, links, CTAs, etc.)
- Is it a standalone block or a collection (repeating items)?
- Does it need variants/styles?
- Are there existing blocks to reference? (`ls blocks/`)

Document the requirements before proceeding.

---

### Step 2: Design Model

**Invoke:** ue-content-modeling skill

Provide:
- Block name and purpose
- Content requirements from Step 1
- Whether standalone or collection pattern

The ue-content-modeling skill will guide you through:
- Choosing the right pattern (standalone vs collection)
- Defining fields with appropriate component types
- Validating the model structure
- Creating the JSON file

---

### Step 3: Create Model JSON

Create `blocks/{block-name}/_{block-name}.json` following the structure from Step 2.

If the block directory doesn't exist yet:
```bash
mkdir -p blocks/{block-name}
```

---

### Step 4: Register in Section Filter

Add the block ID to `models/_section.json` → `filters[0].components` array:

```json
{
  "filters": [
    {
      "id": "section",
      "components": [
        "text", "image", "button", "title",
        "hero", "cards", "columns", "fragment",
        "{new-block-name}"
      ]
    }
  ]
}
```

Without this, authors won't be able to add the block to sections in the UE.

---

### Step 5: Build & Validate JSON

```bash
npm run build:json
```

This merges all model files into the three root JSON files. Verify:

```bash
findstr /i "{block-name}" component-definition.json
findstr /i "{block-name}" component-models.json
findstr /i "{block-name}" component-filters.json
```

All three must show results. If any is missing, check your JSON structure.

---

### Step 6: Lint

```bash
npm run lint
```

Fix any issues. The `eslint-plugin-xwalk` validates model JSON files.

---

### Step 7: Ship Model PR

1. Create feature branch:
   ```bash
   git checkout -b feat/{block-name}-model
   ```

2. Stage files:
   ```bash
   git add blocks/{block-name}/_{block-name}.json
   git add models/_section.json
   git add component-definition.json component-models.json component-filters.json
   ```

3. Commit and push:
   ```bash
   git commit -m "feat({block-name}): add component model for UE"
   git push origin HEAD
   ```

4. Create PR:
   ```bash
   gh pr create --title "feat({block-name}): add component model" --body "Adds Universal Editor component model for {block-name} block.

   ## Next Steps
   After merge:
   1. Create {block-name} content in Universal Editor
   2. Preview at https://main--{repo}--{owner}.aem.page/{path}
   3. Implement decoration (JS/CSS) in follow-up PR"
   ```

**After the PR is merged:**
- Inform the user they can now add the block in the Universal Editor
- The block will appear in the component picker under the section
- Ask the user to create content and provide the preview URL
- Once content exists, proceed to **Phase 2: BUILD**

---

## Phase 2: BUILD

### Step 0: Create Todo List

Create a todo list with these tasks:

1. **Fetch UE-generated HTML** — Get the `.plain.html` from preview
2. **Analyze HTML structure** — Understand what the UE generated
3. **Implement decoration** — CSS-first, JS if needed
4. **Lint & test** — Validate code quality
5. **Validate on preview** — Check feature branch preview
6. **Ship build PR** — Create PR with decoration code

---

### Step 1: Fetch UE-Generated HTML

Get the HTML that the UE generated for the block:

```bash
curl https://main--{repo}--{owner}.aem.page/{path}.plain.html
```

Or if the user provides a preview URL, use that.

Save this locally for reference and local development:
```bash
mkdir -p drafts/tmp
curl -o drafts/tmp/{block-name}.plain.html https://main--{repo}--{owner}.aem.page/{path}.plain.html
```

**Important:** This HTML is the REAL contract. The model defines fields, but the HTML shows how they render. Always develop against this output.

---

### Step 2: Analyze HTML Structure

Examine the fetched HTML to understand:
- How block rows and columns are structured
- Where `picture` elements appear (from `reference` fields)
- How rich text renders (from `richtext` fields)
- How links/buttons appear (from `aem-content` / `text` fields)
- `data-aue-*` attributes for editability

Document the structure before implementing.

---

### Step 3: Implement Decoration

**Invoke:** ue-building-blocks skill

Provide:
- The fetched `.plain.html` content
- Design requirements / visual goals
- Analysis from previous steps

The ue-building-blocks skill will guide you through:
- Deciding if JS is needed (CSS-first approach)
- Implementing CSS styling
- Implementing JS decoration (if needed, with `moveInstrumentation()`)

---

### Step 4: Lint & Test

```bash
npm run lint
```

Fix any issues with `npm run lint:fix` for auto-fixable problems.

---

### Step 5: Validate on Preview

Start the local dev server if not running:
```bash
aem up --no-open --forward-browser-logs
```

If using local test content:
```bash
aem up --html-folder drafts --no-open --forward-browser-logs
```

Validate:
- Block renders correctly at test URL
- Responsive behavior (mobile, tablet, desktop)
- No console errors
- If UE editing works (when testing on preview environment)

---

### Step 6: Ship Build PR

1. Create feature branch:
   ```bash
   git checkout -b feat/{block-name}-build
   ```

2. Stage only decoration files:
   ```bash
   git add blocks/{block-name}/{block-name}.js blocks/{block-name}/{block-name}.css
   ```

3. Commit and push:
   ```bash
   git commit -m "feat({block-name}): add block decoration"
   git push origin HEAD
   ```

4. Create PR with preview link:
   ```bash
   gh pr create --title "feat({block-name}): add block decoration" --body "Implements JS/CSS decoration for {block-name} block.

   ## Preview
   https://feat-{block-name}-build--{repo}--{owner}.aem.page/{path}

   ## Changes
   - {block-name}.css: [describe styling]
   - {block-name}.js: [describe decoration, or 'CSS-only, no JS needed']"
   ```

**REQUIRED:** The preview link in the PR description is used for automated PSI checks. Without it, the PR will be rejected.

---

## Handling Both Phases in One Session

When creating a completely new block, you'll go through both phases. The natural break point is after Phase 1 Step 7 (Ship Model PR), when you need:

1. The PR to be merged to main
2. An author to create content in the UE
3. The content to be previewed

**If the user can't wait:**
- You can create a mock `.plain.html` in `drafts/tmp/` based on what you expect the UE to generate
- Develop against that locally
- But **ALWAYS validate** against the real UE output when available
- The mock may not match exactly — be prepared to adjust

**Expected HTML for model fields (approximation):**

| Model Field | Expected HTML |
|------------|---------------|
| `reference` (image) | `<picture><source>...<img></picture>` in its own `<div>` |
| `text` (string) | `<p>value</p>` or raw text in a `<div>` |
| `richtext` | HTML content (h1-h6, p, a, strong, em, ul, ol) in a `<div>` |
| `aem-content` (link) | `<a href="...">` |
| `select` / `multiselect` | Applied as block variant class or section metadata |

---

## Quick Reference

### Project-Specific Commands
```bash
npm run build:json          # Merge model JSONs → root files
npm run lint                # Run all linters
npm run lint:fix            # Auto-fix lint issues
aem up --no-open            # Start dev server
```

### Key Files
```
blocks/{name}/_{name}.json  # Block model (definitions + models + filters)
models/_section.json        # Section filter (register blocks here)
models/_component-*.json    # Merge templates (auto-discover blocks/*/_*.json)
component-*.json            # Generated root files (from build:json)
scripts/scripts.js          # moveInstrumentation() lives here
```

### Preview URL Patterns
```
https://main--{repo}--{owner}.aem.page/{path}           # Main preview
https://{branch}--{repo}--{owner}.aem.page/{path}       # Branch preview
https://main--{repo}--{owner}.aem.page/{path}.plain.html # Raw HTML output
```
