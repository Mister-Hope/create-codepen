import type { CodePenDomOptions, CodePenOptions } from "./options.js";
import { getOptionsFromDom } from "./options.js";
import { getPostLink } from "./postlink.js";
import { getType } from "./types.js";
import { createElement } from "./utils.js";

/** @private */
interface CodePenConfig extends CodePenOptions {
  data?: string;

  name?: string;
}

const ALLOWED_ATTRIBUTES = [
  "title",
  "description",
  "tags",
  "html_classes",
  "head",
  "stylesheets",
  "scripts",
];

const getDataFromDOM = (container: HTMLElement): string | void => {
  if (Object.hasOwn(container.dataset, "prefill")) {
    const options: Record<string, unknown> = {};

    const prefillOptions = JSON.parse(
      // eslint-disable-next-line  @typescript-eslint/prefer-nullish-coalescing
      decodeURI(container.dataset.prefill || "{}"),
    ) as Record<string, unknown>;

    for (const key in prefillOptions)
      if (ALLOWED_ATTRIBUTES.includes(key)) options[key] = prefillOptions[key];

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>("[data-lang]"),
    );

    elements.forEach((element) => {
      const { lang, langVersion, optionsAutoprefixer } = element.dataset;

      if (optionsAutoprefixer) options.css_prefix = "autoprefixer";

      const type = getType(lang);

      options[type] = element.innerText;

      if (lang !== type) options[type + "_pre_processor"] = lang;
      if (langVersion) options[type + "_version"] = langVersion;
    });

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

  for (const key in options)
    if (key !== "prefill")
      form.append(
        createElement("input", {
          type: "hidden",
          name: key,
          value: String(options[key]),
        }),
      );

  return form;
};

export const getIframe = (options: CodePenConfig): HTMLIFrameElement => {
  const {
    height = 300,
    class: className = "",
    name = "CodePen Embed",
  } = options;
  const attribute: Record<string, string | number> = {
    class: `cp_embed_iframe ${className}`,
    src: getPostLink(options),
    allowfullscreen: "",
    allowpaymentrequest: "",
    allowTransparency: "",
    frameborder: 0,
    width: "100%",
    height,
    name,
    scrolling: "no",
    style: "width: 100%; overflow: hidden; display: block;",
    title: options["pen-title"] ?? name,
  };

  if (!("prefill" in options)) attribute.loading = "lazy";

  if (options["slug-hash"])
    attribute.id = `code-pen-embed-${options["slug-hash"].replace("/", "_")}`;

  return createElement("iframe", attribute);
};

export const appendFragment = (
  container: HTMLElement,
  docFragment: DocumentFragment,
): HTMLElement => {
  if (container.parentNode) {
    const div = document.createElement("div");

    div.className = "code-pen-embed-wrapper";
    div.append(docFragment);

    container.parentNode.replaceChild(div, container);

    return div;
  }

  container.append(docFragment);

  return container;
};

const generateFormWrapper = (
  options: CodePenDomOptions,
  container: HTMLElement,
): void => {
  const docFragment = document.createDocumentFragment();
  let form: HTMLFormElement | null = null;

  if (options.open === "true") {
    if ("prefill" in options) {
      const data = getDataFromDOM(container);

      if (data) options.data = data;

      form = getForm(options);
      container.appendChild(form);
      form.submit();
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

const renderCodePens = (
  selector: string,
  _options: CodePenDomOptions,
): void => {
  const containers = Array.from(
    document.querySelectorAll<HTMLElement>(selector),
  );

  for (const container of containers) {
    const options: CodePenConfig = {
      ..._options,
      ...getOptionsFromDom(container),
      name: `code-pen-embed-${idIndex++}`,
    };

    generateFormWrapper(options, container);
  }
};

export const loadCodePens = (
  selector = ".codepen",
  options: CodePenDomOptions = {},
): void => {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => {
      renderCodePens(selector, options);
    });
  else renderCodePens(selector, options);
};

export const openCodePens = (selector = ".codepen"): void =>
  loadCodePens(selector, { open: "true" });
