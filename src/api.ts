import { appendFragment, getForm, getIframe } from "./dom.js";
import type { CodePenOptions } from "./options.js";

let idIndex = 1;

export const renderCodePen = (options: CodePenOptions, selector?: string | HTMLElement): void => {
  const container =
    typeof selector === "string" ? document.querySelector<HTMLElement>(selector) : selector;

  if (!(container instanceof HTMLElement) && selector != null) {
    // oxlint-disable-next-line typescript/no-base-to-string
    throw new TypeError(`Invalid selector: ${selector?.toString()}`);
  }

  options.user ??= "anon";
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
  } else {
    document.body.append(docFragment);
  }

  if (form) form.submit();
};
