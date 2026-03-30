# create-codepen

A browser library for embedding CodePen content via the CodePen embed API. Zero Node.js dependencies, ESM-only, targets modern browsers (ES2020+).

## Installation

```html
<script type="module">
  import { renderCodePen } from "https://unpkg.com/create-codepen";
</script>
```

## API Reference

### renderCodePen(options, selector?)

Renders a CodePen iframe. If `selector` is provided, embeds inside that element; otherwise opens in a new window.

```ts
renderCodePen(options: CodePenOptions, selector?: string | HTMLElement): void
```

#### Parameters

| Parameter  | Type                    | Description                             |
| ---------- | ----------------------- | --------------------------------------- |
| `options`  | `CodePenOptions`        | Embed configuration (see Options below) |
| `selector` | `string \| HTMLElement` | Optional target element to embed into   |

#### Example

```html
<div id="pen-container"></div>

<script type="module">
  import { renderCodePen } from "https://unpkg.com/create-codepen";

  renderCodePen(
    {
      "slug-hash": "XWJPxpZ",
      user: "Mamboleoo",
      height: 300,
      "theme-id": "light",
      "default-tab": "js,result",
    },
    "#pen-container",
  );
</script>
```

---

### loadCodePens(selector?, options?)

Auto-embeds CodePens from DOM elements matching `selector` (default: `.codepen`). Scans for `data-*` attributes on elements and renders embeds accordingly.

```ts
loadCodePens(selector?: string, options?: CodePenDomOptions): void
```

#### Example

```html
<p
  class="codepen"
  data-slug-hash="XWJPxpZ"
  data-user="Mamboleoo"
  data-height="265"
  data-theme-id="light"
  data-default-tab="js,result"
>
  See the Pen <a href="https://codepen.io/Mamboleoo/pen/XWJPxpZ">Walkers - How to</a> by Louis
  Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>)
</p>

<script type="module">
  import { loadCodePens } from "https://unpkg.com/create-codepen";
  loadCodePens();
</script>
```

---

### openCodePens(selector?)

Opens CodePens from DOM elements in a new window instead of embedding.

```ts
openCodePens(selector?: string): void
```

#### Example

```html
<p
  class="codepen-open"
  data-slug-hash="XWJPxpZ"
  data-user="Mamboleoo"
  data-theme-id="light"
  data-default-tab="js,result"
>
  See the Pen Walkers - How to by Louis Hoebregts (@Mamboleoo)
</p>

<script type="module">
  import { openCodePens } from "https://unpkg.com/create-codepen";
  openCodePens(".codepen-open");
</script>
```

---

## Options

### General Embed Options

Used by `renderCodePen()` and `loadCodePens()`.

| Option        | Type                      | Default    | Description                                                                       |
| ------------- | ------------------------- | ---------- | --------------------------------------------------------------------------------- |
| `slug-hash`   | `string`                  | —          | CodePen ID (e.g., `XWJPxpZ`). **Required** for non-prefill embeds                 |
| `user`        | `string`                  | `"anon"`   | CodePen username                                                                  |
| `default-tab` | `string`                  | `"result"` | Tab(s) shown initially: `"html"`, `"css"`, `"js"`, `"result"`, or comma-separated |
| `theme-id`    | `string \| number`        | `0`        | Theme ID (e.g., `"light"`)                                                        |
| `pen-title`   | `string`                  | —          | Title for the embed iframe                                                        |
| `open`        | `"true" \| "false"`       | `"false"`  | Open in new window instead of embedding                                           |
| `editable`    | `"true" \| "false"`       | `"false"`  | Allow editing in embed                                                            |
| `preview`     | `"true" \| "false"`       | `"false"`  | Show preview mode                                                                 |
| `animations`  | `"run" \| "stop-after-5"` | —          | Animation behavior                                                                |
| `zoom`        | `1 \| 0.5 \| 0.25`        | `1`        | Zoom level                                                                        |
| `token`       | `string`                  | —          | Pen token for private pens                                                        |

---

### Style Options

Customize the embed iframe appearance.

| Option              | Type                          | Default     | Description                         |
| ------------------- | ----------------------------- | ----------- | ----------------------------------- |
| `height`            | `number \| string`            | `300`       | Iframe height in pixels             |
| `border`            | `"none" \| "thin" \| "thick"` | `"none"`    | Border style                        |
| `border-color`      | `string`                      | `"#000000"` | Border color                        |
| `tab-bar-color`     | `string`                      | `"#3d3d3e"` | Tab bar background color            |
| `tab-link-color`    | `string`                      | `"#76daff"` | Tab link color                      |
| `active-tab-color`  | `string`                      | `"#cccccc"` | Active tab background               |
| `active-link-color` | `string`                      | `"#000000"` | Active tab link color               |
| `link-logo-color`   | `string`                      | `"#ffffff"` | CodePen logo color                  |
| `class`             | `string`                      | —           | Additional CSS class for the iframe |
| `custom-css-url`    | `string`                      | —           | URL to custom CSS file              |

---

### Prefill Options

Create a new CodePen with inline code. Used inside the `prefill` property.

```ts
renderCodePen({
  prefill: {
    title: "My Pen",
    description: "Description here",
    html: "<div>Hello</div>",
    css: "body { background: #f0f0f0; }",
    js: "console.log('hi')",
  },
});
```

| Option               | Type                 | Description                                                         |
| -------------------- | -------------------- | ------------------------------------------------------------------- |
| `title`              | `string`             | Pen title                                                           |
| `description`        | `string`             | Pen description                                                     |
| `head`               | `string`             | HTML content for `<head>`                                           |
| `tags`               | `string \| string[]` | Tags for the pen                                                    |
| `html`               | `string`             | HTML content                                                        |
| `css`                | `string`             | CSS content                                                         |
| `js`                 | `string`             | JavaScript content                                                  |
| `html_pre_processor` | `string`             | HTML preprocessor (e.g., `"haml"`, `"pug"`, `"slim"`)               |
| `css_pre_processor`  | `string`             | CSS preprocessor (e.g., `"scss"`, `"less"`, `"stylus"`)             |
| `js_pre_processor`   | `string`             | JS preprocessor (e.g., `"babel"`, `"coffeescript"`, `"typescript"`) |
| `html_classes`       | `string \| string[]` | Classes for the `<html>` element                                    |
| `stylesheets`        | `string \| string[]` | External CSS URLs                                                   |
| `scripts`            | `string \| string[]` | External JS URLs                                                    |

---

## Complete Example

### Embed existing pen with custom styling

```html
<div id="embed"></div>

<script type="module">
  import { renderCodePen } from "https://unpkg.com/create-codepen";

  renderCodePen(
    {
      "slug-hash": "XWJPxpZ",
      user: "Mamboleoo",
      height: 400,
      "theme-id": "light",
      "default-tab": "js,result",
      border: "thick",
      "border-color": "#76daff",
    },
    "#embed",
  );
</script>
```

### Create new pen with prefill

```html
<div id="prefill"></div>

<script type="module">
  import { renderCodePen } from "https://unpkg.com/create-codepen";

  renderCodePen(
    {
      "default-tab": "js,result",
      prefill: {
        title: "React Demo",
        description: "A simple React example",
        html: '<div id="root"></div>',
        css: `body { font-family: system-ui; }`,
        js: `document.body.textContent = "Hello!";`,
        css_pre_processor: "scss",
        js_pre_processor: "babel",
      },
    },
    "#prefill",
  );
</script>
```

### Open in new window

```html
<button id="open-btn">Open CodePen</button>

<script type="module">
  import { renderCodePens } from "https://unpkg.com/create-codepen";

  document.querySelector("#open-btn").addEventListener("click", () => {
    renderCodePen({
      "slug-hash": "XWJPxpZ",
      user: "Mamboleoo",
      "default-tab": "js,result",
    });
  });
</script>
```
