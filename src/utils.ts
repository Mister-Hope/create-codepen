export const createElement = <Key extends keyof HTMLElementTagNameMap>(
  tagName: Key,
  attributes: Record<string, string | number>,
): HTMLElementTagNameMap[Key] => {
  const element = document.createElement<Key>(tagName);

  for (const attribute in attributes)
    if (Object.hasOwn(attributes, attribute))
      element.setAttribute(attribute, attributes[attribute].toString());

  return element;
};
