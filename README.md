# EDS xwalk AI

AEM Edge Delivery Services project using **xwalk/Universal Editor** authoring.

## Environments
- Preview: https://main--eds-xwalk-ai--eaugustovt.aem.page/
- Live: https://main--eds-xwalk-ai--eaugustovt.aem.live/

## Documentation

Before using the aem-boilerplate, we recommend you to go through the documentation on [www.aem.live](https://www.aem.live/docs/) and [experienceleague.adobe.com](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/authoring), more specifically:
1. [Getting Started](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started), [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block), [Content Modelling](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

Furthermore, we encourage you to watch the recordings of any of our previous presentations or sessions:
- [Getting started with AEM Authoring and Edge Delivery Services](https://experienceleague.adobe.com/en/docs/events/experience-manager-gems-recordings/gems2024/aem-authoring-and-edge-delivery)

## AI Coding Agents

This project supports AI coding agents using [Adobe EDS Skills](https://github.com/adobe/skills) following the same pattern as [adobe/helix-website](https://github.com/adobe/helix-website).

### Project Structure

| Path | Purpose |
|---|---|
| `.github/copilot-instructions.md` | Instructions for GitHub Copilot |
| `CLAUDE.md` | Instructions for Claude Code |
| `AGENTS.md` | Instructions for other agents (Cursor, etc.) |
| `.claude/skills/` | Adobe EDS skills + custom xwalk skills |
| `.agents/discover-skills` | Script to list available skills |

### Installing Adobe Skills

Skills are installed via [npx skills](https://github.com/vercel-labs/skills) from the [adobe/skills](https://github.com/adobe/skills) repository:

```sh
# Install all AEM EDS skills for Claude Code
npx skills add https://github.com/adobe/skills/tree/main/skills/aem/edge-delivery-services --skill '*' -a claude-code -y
```

To install for additional agents (e.g., Copilot, Cursor):

```sh
npx skills add https://github.com/adobe/skills/tree/main/skills/aem/edge-delivery-services --skill '*' -a claude-code -a github-copilot -y
```

### Discovering Skills

```sh
./.agents/discover-skills
```

### Key Skills

This is a **xwalk/Universal Editor** project. Use the `ue-*` skills as primary entry points:

| Skill | Description |
|---|---|
| `ue-content-driven-development` | **Start here** — orchestrates Model phase (JSON) + Build phase (JS/CSS) |
| `ue-content-modeling` | Create `_block.json` models for the Universal Editor |
| `ue-building-blocks` | CSS-first decoration of UE-generated HTML |

The document-based skills are also available for reference:

| Skill | Description |
|---|---|
| `content-driven-development` | Document-based CDD workflow |
| `building-blocks` | Document-based block implementation |
| `content-modeling` | Document-based content modeling |
| `testing-blocks` | Browser testing and validation |
| `docs-search` | Search aem.live documentation |
| `block-collection-and-party` | Find reference implementations |
| `page-import` | Import/migrate webpages to AEM EDS |

For more details, see the [Adobe Skills repository](https://github.com/adobe/skills) and [AI Coding Agents guide](https://www.aem.live/developer/ai-coding-agents).

## Prerequisites

- nodejs 18.3.x or newer
- AEM Cloud Service release 2024.8 or newer (>= `17465`)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up --no-open` (opens at `http://localhost:3000`)
1. Open the project in your favorite IDE and start coding :)

### Component Models

Blocks use JSON component models for the Universal Editor:

```sh
# After creating/modifying blocks/{name}/_{name}.json
npm run build:json
```

This merges all model files into:
- `component-definition.json`
- `component-models.json`
- `component-filters.json`

**Do not edit the root `component-*.json` files directly.**
