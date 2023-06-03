export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes: Record<string, string | number>
): HTMLElementTagNameMap[K] => {
  const element = document.createElement<K>(tagName);

  for (const attribute in attributes)
    Object.prototype.hasOwnProperty.call(attributes, attribute) &&
      element.setAttribute(attribute, attributes[attribute].toString());

  return element;
};
