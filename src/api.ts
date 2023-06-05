import { appendFragment, getForm, getIframe } from "./dom.js";
import { type DomOptions } from "./options.js";

let idIndex = 1;

export const renderCodePen = (
  selector: string | HTMLElement,
  options: DomOptions
) => {
  const container =
    typeof selector === "string"
      ? document.querySelector<HTMLElement>(selector)
      : selector;

  if (!options.user) options.user = "anon";
  if (!options.name) options.name = `code-pen-api-${idIndex++}`;

  if (container) {
    const docFragment = document.createDocumentFragment();
    let form;

    docFragment.append(getIframe(options));

    if ("prefill" in options) {
      options.data = JSON.stringify(options.prefill || "{}");
      form = getForm(options);
      docFragment.append(form);
    }

    appendFragment(container, docFragment);

    if (form) form.submit();
  }
};
