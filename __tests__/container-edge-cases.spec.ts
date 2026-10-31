import { describe, expect, it } from "vitest";

import { renderCodePen } from "../src/api.js";
import { appendFragment } from "../src/dom.js";

describe("container edge cases", () => {
  it("should throw when a prefill form is rendered before the body exists", () => {
    const { body } = document;

    body.remove();

    try {
      expect(() => renderCodePen({ prefill: { title: "No body" } })).toThrow(/document\.body/u);
    } finally {
      document.documentElement.append(body);
    }
  });

  it("should append into document.body instead of replacing it", () => {
    document.body.innerHTML = "";

    const fragment = document.createDocumentFragment();
    const span = document.createElement("span");
    fragment.append(span);

    const result = appendFragment(document.body, fragment);

    expect(result).toBe(document.body);
    expect(document.body.contains(span)).toBe(true);
    expect(document.documentElement.contains(document.body)).toBe(true);

    span.remove();
  });

  it("should append into document.documentElement instead of replacing it", () => {
    document.body.innerHTML = "";

    const fragment = document.createDocumentFragment();
    const span = document.createElement("span");
    fragment.append(span);

    const result = appendFragment(document.documentElement, fragment);

    expect(result).toBe(document.documentElement);
    expect(document.documentElement.contains(span)).toBe(true);

    span.remove();
  });
});
