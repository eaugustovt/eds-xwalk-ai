# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on [www.aem.live](https://www.aem.live/docs/) and [experienceleague.adobe.com](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/authoring), more specifically:
1. [Getting Started](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started), [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block), [Content Modelling](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

Furthremore, we encourage you to watch the recordings of any of our previous presentations or sessions:
- [Getting started with AEM Authoring and Edge Delivery Services](https://experienceleague.adobe.com/en/docs/events/experience-manager-gems-recordings/gems2024/aem-authoring-and-edge-delivery)

## AI Coding Agents

This project supports AI coding agents using [Adobe EDS Skills](https://github.com/adobe/skills) following the same pattern as [adobe/helix-website](https://github.com/adobe/helix-website).

### Project Structure

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Instructions for Claude Code |
| `AGENTS.md` | Instructions for other agents (Copilot, Cursor, etc.) |
| `.claude/skills/` | Adobe EDS skills (source of truth) |
| `.agents/discover-skills` | Script to list available skills |

### Installing Skills

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

| Skill | Description |
|---|---|
| `content-driven-development` | Start here for ALL code changes — orchestrates the full workflow |
| `building-blocks` | Block implementation (JS decoration, CSS styling) |
| `testing-blocks` | Browser testing and validation |
| `content-modeling` | Design author-friendly content models |
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

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
