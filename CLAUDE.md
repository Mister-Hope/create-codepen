# Claude Code - create-codepen

> **See [AGENTS.md](AGENTS.md)** for detailed architecture, design decisions, and coding conventions.

## Project Summary

**create-codepen** is a browser library that embeds CodePen content via the CodePen embed API. It has no Node.js dependencies and targets modern browsers (ES2020+).

### Public API

```ts
export { renderCodePen } from "./api.js";
export { loadCodePens, openCodePens } from "./dom.js";
export {
  type CodePenOptions,
  type CodePenDomOptions,
  type CodePenStyleOptions,
  type CodePenPrefillOptions,
} from "./options.js";
```

### Quick Reference

| File                               | Purpose                                         |
| ---------------------------------- | ----------------------------------------------- |
| [src/api.ts](src/api.ts)           | `renderCodePen()` - main embedding function     |
| [src/dom.ts](src/dom.ts)           | `loadCodePens()`, `openCodePens()`, DOM helpers |
| [src/postlink.ts](src/postlink.ts) | `getPostLink()` - generates CodePen URLs        |
| [src/options.ts](src/options.ts)   | TypeScript interfaces + `getOptionsFromDom()`   |
| [src/types.ts](src/types.ts)       | `getType()` - categorizes HTML/CSS/JS types     |
| [src/utils.ts](src/utils.ts)       | `createElement()` helper                        |

### Commands

```bash
pnpm build    # Build with tsdown
pnpm test     # Run vitest
pnpm lint     # Run oxlint + oxfmt
pnpm dev      # Vite dev server
```

### Key Constraints

- **Browser-only** - no Node.js APIs used
- **ESM only** - `.js` extensions required in imports
- **Slug-hash required** for non-prefill embeds
- Linting uses **oxlint** (not ESLint) - see `package.json` scripts
