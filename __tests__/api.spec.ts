import { describe, expect, it, vi } from "vitest";

import { renderCodePen } from "../src/api.js";
import type { CodePenOptions } from "../src/options.js";

describe("renderCodePen function", () => {
  it("should render an iframe in the container", () => {
    const container = document.createElement("div");
    renderCodePen({ "slug-hash": "abc" }, container);

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe?.src).toContain("https://codepen.io/anon/embed/abc");
  });

  it("should render using selector", () => {
    const container = document.createElement("div");
    container.id = "test-container";
    document.body.append(container);

    renderCodePen({ "slug-hash": "def" }, "#test-container");

    const wrapper = document.querySelector(".code-pen-embed-wrapper");
    expect(wrapper).toBeTruthy();
    const iframe = wrapper?.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe?.src).toContain("https://codepen.io/anon/embed/def");

    container.remove();
  });

  it("should open in new window if selector is not provided", () => {
    const submitSpy = vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(() => {});

    renderCodePen({ prefill: { title: "Test" } });

    const form = document.body.querySelector("form");
    expect(form).toBeTruthy();
    expect(form?.target).toBe("_blank");
    expect(form?.method).toBe("post");
    expect(form?.action).toContain("https://codepen.io/embed/prefill");

    expect(submitSpy).toHaveBeenCalledWith();
    submitSpy.mockRestore();
  });

  it("should open in new window for non-prefill pens when selector is not provided", () => {
    const openSpy = vi.spyOn(globalThis, "open").mockReturnValue(null);

    renderCodePen({ "slug-hash": "abc" });

    expect(openSpy).toHaveBeenCalledWith(
      "https://codepen.io/anon/embed/abc?slug-hash=abc&user=anon&name=_blank",
      "_blank",
    );

    openSpy.mockRestore();
  });

  it("should not submit a form when opening a non-prefill pen in a new window", () => {
    const openSpy = vi.spyOn(globalThis, "open").mockReturnValue(null);
    const submitSpy = vi.spyOn(HTMLFormElement.prototype, "submit");

    renderCodePen({ "slug-hash": "abc" });

    expect(submitSpy).not.toHaveBeenCalled();

    openSpy.mockRestore();
    submitSpy.mockRestore();
  });

  it("should not mutate the caller's options object", () => {
    const options: CodePenOptions = { "slug-hash": "abc" };
    const container = document.createElement("div");

    renderCodePen(options, container);

    expect(options).toStrictEqual({ "slug-hash": "abc" });
  });

  it("should assign a unique iframe name when reusing the same options object", () => {
    const options: CodePenOptions = { "slug-hash": "abc" };
    const first = document.createElement("div");
    const second = document.createElement("div");

    renderCodePen(options, first);
    renderCodePen(options, second);

    const names = [first, second].map((container) =>
      container.querySelector("iframe")?.getAttribute("name"),
    );

    expect(names[0]).not.toBe(names[1]);
  });

  it("should not create duplicate iframe ids for the same slug-hash", () => {
    document.body.innerHTML = "";

    const first = document.createElement("div");
    first.className = "test-dup-1";
    document.body.append(first);
    const second = document.createElement("div");
    second.className = "test-dup-2";
    document.body.append(second);

    renderCodePen({ "slug-hash": "same" }, ".test-dup-1");
    renderCodePen({ "slug-hash": "same" }, ".test-dup-2");

    const ids = [...document.querySelectorAll("iframe")].map((iframe) => iframe.id);

    expect(ids).toHaveLength(2);
    expect(ids[0]).toBe("code-pen-embed-same");
    expect(new Set(ids).size).toBe(2);
  });

  it("should not create duplicate iframe ids when containers are detached", () => {
    const first = document.createElement("div");
    const second = document.createElement("div");

    renderCodePen({ "slug-hash": "unmounted" }, first);
    renderCodePen({ "slug-hash": "unmounted" }, second);

    const ids = [first, second].map((container) => container.querySelector("iframe")?.id);

    expect(ids[0]).toBe("code-pen-embed-unmounted");
    expect(new Set(ids).size).toBe(2);
  });

  it("should handle prefill options", () => {
    const container = document.createElement("div");

    renderCodePen({ prefill: { title: "Test" }, "slug-hash": "ghi" }, container);

    const form = container.querySelector("form")!;
    expect(form).toBeTruthy();

    const dataInput = form.querySelector<HTMLInputElement>('input[name="data"]')!;

    expect(dataInput.value).toBe('{"title":"Test"}');
  });

  it("should handle prefill: undefined", () => {
    const container = document.createElement("div");

    renderCodePen({ prefill: undefined, "slug-hash": "ghi" }, container);

    const form = container.querySelector("form")!;
    expect(form).toBeTruthy();

    const dataInput = form.querySelector<HTMLInputElement>('input[name="data"]')!;

    expect(dataInput.value).toBe("{}");
  });

  it("should throw error if selector is invalid", () => {
    expect(() => {
      renderCodePen({ "slug-hash": "xyz" }, "#non-existent");
    }).toThrow("Invalid selector: #non-existent");

    expect(() => {
      // oxlint-disable-next-line typescript/no-unsafe-argument
      renderCodePen({ "slug-hash": "xyz" }, 123 as any);
    }).toThrow("Invalid selector: 123");
  });
});
