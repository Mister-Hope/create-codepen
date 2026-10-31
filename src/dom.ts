import type { CodePenDomOptions, CodePenOptions } from "./options.js";
import { getOptionsFromDom } from "./options.js";
import { getPostLink } from "./postlink.js";
import { getType } from "./types.js";
import { createElement } from "./utils.js";

interface CodePenConfig extends CodePenOptions {
  data?: string;

  name?: string;
}

const ALLOWED_ATTRIBUTES = new Set([
  "title",
  "description",
  "tags",
  "html_classes",
  "head",
  "stylesheets",
  "scripts",
]);

const parsePrefillValue = (value: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(value) as unknown;

    return typeof parsed === "object" && parsed != null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
};

const parsePrefill = (raw: string | undefined): Record<string, unknown> | null => {
  if (!raw) return null;

  const direct = parsePrefillValue(raw);

  if (direct) return direct;

  // data-prefill may also be URL-encoded JSON. A lone "%" (e.g. CSS like
  // "width:100%") makes decodeURIComponent throw, so escape stray percent
  // signs first and never let a malformed value abort the whole render loop.
  try {
    return parsePrefillValue(decodeURIComponent(raw.replaceAll(/%(?![0-9a-f]{2})/giu, "%25")));
  } catch {
    return null;
  }
};

const getDataFromDOM = (container: HTMLElement): string | void => {
  if (Object.hasOwn(container.dataset, "prefill")) {
    const options: Record<string, unknown> = {};

    const prefillOptions = parsePrefill(container.dataset.prefill) ?? {};

    for (const key in prefillOptions)
      if (ALLOWED_ATTRIBUTES.has(key)) options[key] = prefillOptions[key];

    const elements = [...container.querySelectorAll<HTMLElement>("[data-lang]")];

    for (const element of elements) {
      // the element matched the [data-lang] selector above, so the attribute exists
      const lang = String(element.dataset.lang).trim().toLowerCase();
      const { langVersion } = element.dataset;
      const type = getType(lang);

      // unsupported languages would otherwise be sent as `unknown` and
      // `unknown_pre_processor`, which silently drops the code
      if (type === "unknown") continue;

      if ("optionsAutoprefixer" in element.dataset) options.css_prefix = "autoprefixer";

      options[type] = element.textContent;

      if (lang !== type) options[`${type}_pre_processor`] = lang;
      if (langVersion) options[`${type}_version`] = langVersion;
    }

    return JSON.stringify(options);
  }
};

export const getForm = (options: CodePenConfig): HTMLFormElement => {
  const form = createElement("form", {
    class: "code-pen-embed-form",
    style: "display: none;",
    method: "post",
    action: getPostLink(options),
    target: options.name ?? "",
  });

  for (const key of Object.keys(options)) {
    // `prefill` is sent as the JSON `data` field and `name` is internal
    if (key === "prefill" || key === "name") continue;

    const value = options[key];

    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean")
      continue;

    form.append(
      createElement("input", {
        type: "hidden",
        name: key,
        value: String(value),
      }),
    );
  }

  return form;
};

const usedIframeIds = new Set<string>();

export const getIframe = (options: CodePenConfig): HTMLIFrameElement => {
  const { height = 300, class: className = "", name = "CodePen Embed" } = options;
  const { "slug-hash": slugHash, "pen-title": penTitle } = options;

  let title = penTitle?.trim() ?? "";

  if (title === "") {
    title = "CodePen Embed";

    if (slugHash) title = `CodePen embed: ${slugHash}`;
  }

  const attribute: Record<string, string | number> = {
    class: `cp_embed_iframe ${className}`.trim(),
    src: getPostLink(options),
    allowfullscreen: "",
    width: "100%",
    height,
    name,
    style: "width: 100%; overflow: hidden; display: block;",
    title,
  };

  if (!("prefill" in options)) attribute.loading = "lazy";

  if (slugHash) {
    const baseId = `code-pen-embed-${slugHash.replace("/", "_")}`;

    // avoid duplicate ids when the same pen is embedded more than once, even
    // when the container is not attached to the document yet
    const id = usedIframeIds.has(baseId) ? `${baseId}-${name}` : baseId;

    usedIframeIds.add(id);
    attribute.id = id;
  }

  return createElement("iframe", attribute);
};

export const appendFragment = (
  container: HTMLElement,
  docFragment: DocumentFragment,
): HTMLElement => {
  // rendering into an existing wrapper replaces its content instead of
  // nesting a second embed, which makes repeated renders idempotent
  if (container.dataset.codePenRendered === "true") {
    container.replaceChildren(docFragment);

    return container;
  }

  if (container.parentNode) {
    // replacing <body> or <html> would remove the whole page
    if (container === document.body || container === document.documentElement) {
      container.append(docFragment);

      return container;
    }

    const div = document.createElement("div");

    div.className = "code-pen-embed-wrapper";
    div.dataset.codePenRendered = "true";

    // keep the host id so the same selector can target the wrapper later
    if (container.id) div.id = container.id;

    div.append(docFragment);

    container.parentNode.replaceChild(div, container);

    return div;
  }

  container.dataset.codePenRendered = "true";
  container.append(docFragment);

  return container;
};

const generateFormWrapper = (options: CodePenDomOptions, container: HTMLElement): void => {
  const docFragment = document.createDocumentFragment();
  let form: HTMLFormElement | null = null;

  if (options.open === "true") {
    if ("prefill" in options) {
      const data = getDataFromDOM(container);

      // without prefill content there is nothing meaningful to open
      if (data) {
        options.data = data;

        form = getForm(options);
        container.append(form);
        form.submit();
        // the pen opens in a new window, so the hidden form is not needed anymore
        form.remove();
      }
    } else {
      window.open(getPostLink(options), "_blank");
    }

    return;
  }

  if ("prefill" in options) {
    const data = getDataFromDOM(container);

    if (data) options.data = data;

    form = getForm(options);
    docFragment.append(form);
  }

  docFragment.append(getIframe(options));
  appendFragment(container, docFragment);

  if (form) form.submit();
};

let idIndex = 1;

const renderCodePens = (selector: string, _options: CodePenDomOptions): void => {
  const containers = [...document.querySelectorAll<HTMLElement>(selector)];

  for (const container of containers) {
    const domOptions = getOptionsFromDom(container);

    // a container without slug-hash or prefill is not a CodePen embed;
    // skip it instead of letting getPostLink throw and abort the whole loop
    if (!domOptions) continue;

    const options: CodePenConfig = {
      ..._options,
      ...domOptions,
      // oxlint-disable-next-line no-plusplus
      name: `code-pen-embed-${idIndex++}`,
    };

    generateFormWrapper(options, container);
  }
};

export const loadCodePens = (selector = ".codepen", options: CodePenDomOptions = {}): void => {
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        renderCodePens(selector, options);
      },
      { once: true },
    );
  } else {
    renderCodePens(selector, options);
  }
};

export const openCodePens = (selector = ".codepen"): void => {
  loadCodePens(selector, { open: "true" });
};
