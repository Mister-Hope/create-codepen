# Agent Guidelines for create-codepen

## Project Overview

**create-codepen** is a browser library for embedding CodePen content via the CodePen API. It provides three main APIs:

- `renderCodePen(options, selector)` - Programmatic embedding with full control
- `loadCodePens(selector, options)` - DOM-based embedding matching CodePen's embed script
- `openCodePens(selector)` - Open CodePens in new windows

Target: browser-only, ES2020+ with no Node.js dependencies.

## Architecture

```
src/
├── index.ts      # Public exports only
├── types.ts      # Type detection utilities (getType for HTML/CSS/JS categorization)
├── options.ts    # TypeScript interfaces + getOptionsFromDom()
├── postlink.ts   # getPostLink() - generates CodePen embed/preview URLs
├── api.ts        # renderCodePen() - main embedding logic
├── dom.ts        # loadCodePens(), openCodePens(), getForm(), getIframe(), appendFragment()
└── utils.ts      # createElement() helper
```

## Key Design Decisions

### URL Generation

- CodePen embed URL format: `https://codepen.io/{user}/embed/{slug-hash}?{query}`
- Prefill URL format: `https://codepen.io/embed/prefill`
- Uses `codepen.io` only (not `codepen.dev`)
- Query params must be URI-encoded

### Type Detection (types.ts)

Maps CodePen's type strings to normalized types:

- HTML types: `html`, `xml`, `haml`, `markdown`, `slim`, `pug`
- CSS types: `css`, `less`, `scss`, `sass`, `stylus`, `postcss`
- JS types: `js`, `javascript`, `coffeescript`, `livescript`, `typescript`, `babel`
- Custom editors: `vue` → `js`, `flutter` → `js`

### Prefill Handling

When `prefill` is in options:

1. `options.data` is set to `JSON.stringify(options.prefill)`
2. A hidden `<form>` is created and submitted (POST to CodePen)
3. The iframe is embedded for preview

When `prefill` is absent:

- Slug-hash is required
- Uses GET embed URL with query params
- `loading="lazy"` is added to iframe

### DOM Replacement

`appendFragment()` replaces the original container with a wrapper `<div class="code-pen-embed-wrapper">` when the container has a parent, preserving DOM position.

### Iframe Naming

- API-rendered: `code-pen-api-{idIndex++}` or `_blank` for window
- DOM-loaded: `code-pen-embed-{idIndex++}`

## Code Style

- Uses **oxlint** + **oxfmt** for linting/formatting (not ESLint/Prettier)
- ES modules only (`import/export`, `.js` extensions in imports)
- TypeScript with strict mode via `@mr-hope/tsconfig`
- Tests run with **vitest** + jsdom environment
- Coverage via Istanbul (istanbul provider)

## Testing

```bash
pnpm test        # Run tests once
pnpm run dev     # Vite dev server for manual testing
```

Test files are co-located or in `tests/` adjacent to source files.

## Build

```bash
pnpm build       # tsdown production build to dist/
```

Output: ESM + TypeScript declarations in `dist/`.

## Common Pitfalls

1. **Slug-hash required**: `getPostLink()` throws if `slug-hash` is missing (except for prefill)
2. **data- prefix stripping**: DOM attributes `data-*` become options keys without prefix
3. **Prefill form submission**: The form must be appended to DOM before `submit()` is called
4. **Container replacement**: The original element is replaced; don't store references to it
