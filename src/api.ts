import { appendFragment, getForm, getIframe } from "./dom.js";
import type { CodePenOptions } from "./options.js";
import { getPostLink } from "./postlink.js";

let idIndex = 1;

export const renderCodePen = (options: CodePenOptions, selector?: string | HTMLElement): void => {
  const container =
    typeof selector === "string" ? document.querySelector<HTMLElement>(selector) : selector;

  if (!(container instanceof HTMLElement) && selector != null) {
    // oxlint-disable-next-line typescript/no-base-to-string
    throw new TypeError(`Invalid selector: ${selector?.toString()}`);
  }

  // work on a copy so the caller's options object is never mutated
  const config: CodePenOptions = { ...options };

  config.user ??= "anon";
  // oxlint-disable-next-line no-plusplus
  config.name ??= container ? `code-pen-api-${idIndex++}` : "_blank";

  const docFragment = document.createDocumentFragment();
  let form: HTMLFormElement | null = null;

  if ("prefill" in config) {
    config.data = JSON.stringify(config.prefill ?? {});
    form = getForm(config);
    docFragment.append(form);
  }

  if (container) {
    docFragment.append(getIframe(config));
    appendFragment(container, docFragment);
  } else if (form) {
    document.body.append(docFragment);
  } else {
    window.open(getPostLink(config), "_blank");
  }

  if (form) form.submit();
};
