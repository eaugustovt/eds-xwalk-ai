---
name: stitch
description: Orchestrator skill for all Stitch-related workflows in AEM Edge Delivery Services (xwalk/Universal Editor) projects. Coordinates design system sync, token export, screen generation, and documentation using Google Stitch MCP. Delegates to specialized sub-skills (design-md, enhance-prompt, remotion, stitch-design, stitch-loop).
allowed-tools:
  - mcp_stitch_list_projects
  - mcp_stitch_get_project
  - mcp_stitch_list_design_systems
  - mcp_stitch_create_design_system
  - mcp_stitch_update_design_system
  - mcp_stitch_list_screens
  - mcp_stitch_get_screen
  - mcp_stitch_generate_screen_from_text
  - mcp_stitch_edit_screens
  - mcp_stitch_generate_variants
  - mcp_stitch_apply_design_system
---

# stitch

## Purpose
Orchestrates all Stitch-related workflows for AEM Edge Delivery Services (xwalk/Universal Editor) projects. Automates and documents the integration of Google Stitch design systems (tokens, documentation, screens) with the project codebase.

---

## Project Context
This project is an **AEM Edge Delivery Services (Universal Editor/xwalk)** site:
- Blocks are defined in `blocks/{block}/_{block}.json` (model), `blocks/{block}/{block}.js` (decoration), and `blocks/{block}/{block}.css` (styles).
- Design tokens from Stitch are exported as CSS custom properties and imported in `styles/tokens.css`.
- The design system is documented in `.stitch/DESIGN.md`.
- No React, Next.js, or Tailwind. Use vanilla CSS and JS only.
- All selectors must be block-scoped (e.g., `.block-name { ... }`).

---

## Workflows

### 1. Exporting Tokens from Stitch
- Export tokens (colors, typography, spacing) as CSS custom properties.
- Save/export as `styles/tokens.css`.
- Example:
  ```css
  :root {
    --color-primary: #5c5c5c;
    --color-secondary: #7d563b;
    --font-display: 'Manrope', sans-serif;
    --font-body: 'Inter', sans-serif;
    /* ... */
  }
  ```

### 2. Documenting the Design System
- Copy/adapt the design system documentation from Stitch to `.stitch/DESIGN.md`.
- Include: color palette, typography, spacing, elevation, glassmorphism, component guidelines, accessibility, and update instructions.

### 3. Consuming Tokens in Blocks
- Import `styles/tokens.css` in your global CSS.
- Use tokens in block CSS via `var(--token-name)`.
- Example:
  ```css
  .hero {
    background: var(--color-background);
    color: var(--color-primary);
    font-family: var(--font-display);
  }
  ```

### 4. Updating the Design System
- When the design system changes in Stitch:
  1. Re-export tokens and overwrite `styles/tokens.css`.
  2. Update `.stitch/DESIGN.md` as needed.

---

## Best Practices
- Always scope CSS to the block.
- Use only CSS custom properties for design tokens.
- Keep `.stitch/DESIGN.md` in sync with `tokens.css`.
- Never use frameworks como React, Next.js, Tailwind.
- Use o Universal Editor para validar a estrutura dos blocos.

---

## Acceptance Criteria
- Only AEM EDS xwalk-compatible workflows and formats are referenced.
- No mention of React, Next.js, Tailwind, or other frameworks.
- Practical examples for token integration and documentation.
- Clear guidance for both designers and developers.

---

## To Do (as the skill grows)
- [ ] Automatizar exportação de tokens Stitch via script/CLI.
- [ ] Adicionar exemplos de integração de screens HTML do Stitch como referência para blocos.
- [ ] Incluir instruções para integração com skills complementares (enhance-prompt, design-md, remotion, etc).
- [ ] Adicionar troubleshooting e FAQ.
