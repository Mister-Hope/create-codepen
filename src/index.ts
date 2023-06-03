import { type Options, getOptions } from "./options.js";
import { getPostLink } from "./postlink.js";
import { getType } from "./types.js";
import { createElement } from "./utils.js";

const ALLOWED_ATTRIBUTES = [
  "title",
  "description",
  "tags",
  "html_classes",
  "head",
  "stylesheets",
  "scripts",
];

const getDataFromDom = (container: HTMLElement): string | void => {
  if (Object.hasOwn(container.dataset, "prefill")) {
    const options: Record<string, unknown> = {};

    const prefillOptions = <Record<string, unknown>>(
      JSON.parse(decodeURI(container.dataset["prefill"]!) || "{}")
    );

    for (const key in prefillOptions)
      if (ALLOWED_ATTRIBUTES.includes(key)) options[key] = prefillOptions[key];

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>("[data-lang]")
    );

    elements.forEach((element) => {
      const { lang, langVersion, optionsAutoprefixer } = element.dataset;

      if (optionsAutoprefixer) options["css_prefix"] = "autoprefixer";

      const type = getType(lang);

      options[type] = element.innerText;

      if (lang !== type) options[type + "_pre_processor"] = lang;
      if (langVersion) options[type + "_version"] = langVersion;
    });

    return JSON.stringify(options);
  }
};

const generateForm = (
  options: Options,
  container: HTMLElement
): HTMLFormElement => {
  const form = createElement("form", {
    class: "code-pen-embed-form",
    style: "display: none;",
    method: "post",
    action: getPostLink(options),
    target: options.name || "",
  });
  const data = getDataFromDom(container);

  if (data) options.data = data;

  for (const key in options)
    if (key !== "prefill")
      form.append(
        createElement("input", {
          type: "hidden",
          name: key,
          value: options[key].toString(),
        })
      );

  return form;
};

const getIframe = (options: Options): HTMLIFrameElement => {
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
    title: options["pen-title"] || name,
  };

  if (!("prefill" in options)) attribute["loading"] = "lazy";

  if (options["slug-hash"])
    attribute["id"] = `code-pen-embed-${options["slug-hash"].replace(
      "/",
      "_"
    )}`;

  return createElement("iframe", attribute);
};

const appendFragment = (
  container: HTMLElement,
  docFragment: DocumentFragment
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
  options: Options,
  container: HTMLElement
): void => {
  const docFragment = document.createDocumentFragment();
  let form;

  docFragment.append(getIframe(options));

  if ("prefill" in options) {
    form = generateForm(options, container);
    docFragment.append(form);
  }

  appendFragment(container, docFragment);

  if (form) form.submit();
};

let idIndex = 1;

const renderCodePens = (selector = ".codepen"): void => {
  const containers = document.querySelectorAll<HTMLElement>(selector);

  for (let index = 0; index < containers.length; index++) {
    const container = containers[index];
    const options = getOptions(container);

    if (options) {
      options.name = `code-pen-embed-${idIndex++}`;
      generateFormWrapper(options, container);
    }
  }
};

export const loadCodePens = (selector = ".codepen"): void => {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => {
      renderCodePens((selector = ".codepen"));
    });
  else renderCodePens(selector);
};
