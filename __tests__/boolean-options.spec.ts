import { describe, expect, it, vi } from "vitest";

import { renderCodePen } from "../src/api.js";
import { loadCodePens } from "../src/dom.js";
import { isTrue } from "../src/utils.js";

describe("boolean option flags", () => {
  it("should treat boolean true and the string 'true' as true", () => {
    expect(isTrue(true)).toBe(true);
    expect(isTrue("true")).toBe(true);
  });

  it("should treat every other value as false", () => {
    expect(isTrue(false)).toBe(false);
    expect(isTrue("false")).toBe(false);
    expect(isTrue("1")).toBe(false);
    expect(isTrue(1)).toBe(false);
    expect(isTrue(undefined)).toBe(false);
    expect(isTrue(null)).toBe(false);
  });

  it("should accept a boolean preview option", () => {
    const container = document.createElement("div");

    renderCodePen({ "slug-hash": "abc", preview: true }, container);

    expect(container.querySelector("iframe")?.src).toContain(
      "https://codepen.io/anon/embed/preview/abc",
    );
  });

  it("should accept a boolean open option", () => {
    document.body.innerHTML = "";

    const container = document.createElement("div");
    container.className = "codepen-boolean-open";
    container.dataset.slugHash = "abc";
    document.body.append(container);

    const openSpy = vi.spyOn(globalThis, "open").mockReturnValue(null);

    loadCodePens(".codepen-boolean-open", { open: true });

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("https://codepen.io/anon/embed/abc?"),
      "_blank",
    );

    openSpy.mockRestore();
    container.remove();
  });
});
