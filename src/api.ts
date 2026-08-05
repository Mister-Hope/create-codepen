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

  options.user ??= "anon";
  // oxlint-disable-next-line no-plusplus
  options.name ??= container ? `code-pen-api-${idIndex++}` : "_blank";

  const docFragment = document.createDocumentFragment();
  let form: HTMLFormElement | null = null;

  if ("prefill" in options) {
    options.data = JSON.stringify(options.prefill ?? {});
    form = getForm(options);
    docFragment.append(form);
  }

  if (container) {
    docFragment.append(getIframe(options));
    appendFragment(container, docFragment);
  } else if (form) {
    document.body.append(docFragment);
  } else {
    window.open(getPostLink(options), "_blank");
  }

  if (form) form.submit();
};
