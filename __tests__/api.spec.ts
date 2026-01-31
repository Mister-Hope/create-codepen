import { describe, expect, it, vi } from "vitest";
import { renderCodePen } from "../src/api.js";

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
    const submitSpy = vi.fn();
    HTMLFormElement.prototype.submit = submitSpy;

    renderCodePen({ prefill: { title: "Test" } });

    const form = document.body.querySelector("form");
    expect(form).toBeTruthy();
    expect(form?.target).toBe("_blank");
    expect(form?.method).toBe("post");
    expect(form?.action).toContain("https://codepen.io/embed/prefill");

    expect(submitSpy).toHaveBeenCalled();
  });

  it("should handle prefill options", () => {
    const container = document.createElement("div");

    renderCodePen({ prefill: { title: "Test" }, "slug-hash": "ghi" }, container);

    const form = container.querySelector("form")!;
    expect(form).toBeTruthy();

    const dataInput = form.querySelector<HTMLInputElement>('input[name="data"]')!;

    expect(dataInput.value).toEqual('{"title":"Test"}');
  });

  it("should handle prefill: undefined", () => {
    const container = document.createElement("div");

    renderCodePen({ prefill: undefined, "slug-hash": "ghi" }, container);

    const form = container.querySelector("form")!;
    expect(form).toBeTruthy();

    const dataInput = form.querySelector<HTMLInputElement>('input[name="data"]')!;

    expect(dataInput.value).toEqual("{}");
  });

  it("should throw error if selector is invalid", () => {
    expect(() => {
      renderCodePen({ "slug-hash": "xyz" }, "#non-existent");
    }).toThrow("Invalid selector: #non-existent");

    expect(() => {
      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-argument
      renderCodePen({ "slug-hash": "xyz" }, 123 as any);
    }).toThrow("Invalid selector: 123");
  });
});
