# Stitch (Orchestrator Skill)

## Purpose
Coordinates all Stitch-related workflows for AEM Edge Delivery Services (xwalk/Universal Editor) projects.

## Project Context
This project uses AEM Edge Delivery Services (Universal Editor/xwalk):
- Blocks are defined in `blocks/{block}/_{block}.json` (model), `blocks/{block}/{block}.js` (decoration), and `blocks/{block}/{block}.css` (styles).
- Design tokens from Stitch are exported as CSS custom properties in `styles/tokens.css`.
- The design system is documented in `.stitch/DESIGN.md`.
- No React, Next.js, or Tailwind. Use vanilla CSS and JS only.
- All selectors must be block-scoped (e.g., `.block-name { ... }`).

## Main Workflows

### 1. Design System Sync
- Calls `design-md` to update `.stitch/DESIGN.md`.
- Calls `enhance-prompt` to refine design prompts.
- Calls `stitch-design` to generate or update screens.
- Calls `remotion` for video/walkthrough assets.

### 2. Token Export
- Calls `stitch-design` to export tokens as CSS custom properties.
- Updates `styles/tokens.css`.

### 3. Screen Generation
- Calls `enhance-prompt` for prompt improvement.
- Calls `stitch-design` or `stitch-loop` for screen generation.
- Downloads HTML/screenshots to `.stitch/designs/`.

## How to Use

- For any Stitch-related workflow, start with this skill.
- It will delegate to the appropriate sub-skill as needed.

- [stitch-design](../stitch-design/SKILL.md)
- [stitch-loop](../stitch-loop/SKILL.md)# SKILL.md
## Skill: stitch (AEM EDS xwalk integration)

### Purpose

## Instruction: Sync DESIGN.md automatically from Stitch

To keep the design system documentation always up-to-date:

1. Use the Stitch MCP API to list all design systems for the project:
   - Method: `list_design_systems`
   - Payload:
     ```json
     {
       "list_design_systems": {
         "projectId": "11436279411532343242"
       }
     }
     ```
2. Select the desired design system (usually the main one for the project).
3. Fetch the design system details:
   - Method: `get_design_system`
   - Payload:
     ```json
     {
       "get_design_system": {
         "name": "projects/11436279411532343242/designSystems/<designSystemId>"
       }
     }
     ```
4. Extract the `designMd` field from the response.
5. Overwrite the file `.stitch/DESIGN.md` with the content of `designMd`.
6. (Optional) Extract the `tokens` field and update `styles/tokens.css` accordingly.

> This process can be automated by an agent or script. The agent should always fetch the latest design system from Stitch and ensure `.stitch/DESIGN.md` is in sync with the source of truth. Optionally, update the design tokens in `styles/tokens.css` for full alignment.

---
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
