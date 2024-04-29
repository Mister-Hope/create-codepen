import { appendFragment, getForm, getIframe } from "./dom.js";
import type { CodePenOptions } from "./options.js";

let idIndex = 1;

export const renderCodePen = (
  options: CodePenOptions,
  selector?: string | HTMLElement,
): void => {
  const container =
    typeof selector === "string"
      ? document.querySelector<HTMLElement>(selector)
      : selector instanceof HTMLElement
        ? selector
        : null;

  if (!options.user) options.user = "anon";
  if (!options.name)
    options.name = container ? `code-pen-api-${idIndex++}` : "_blank";

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
    document.body.appendChild(docFragment);
  }

  if (form) form.submit();
};
