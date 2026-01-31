import { beforeEach, describe, expect, it, vi } from "vitest";
import { appendFragment, getForm, getIframe, loadCodePens, openCodePens } from "../src/dom.js";
import type { CodePenOptions } from "../src/options.js";

describe("dom helpers", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    // Reset readyState
    Object.defineProperty(document, "readyState", {
      get() {
        return "complete";
      },
      configurable: true,
    });
  });

  describe("getForm function", () => {
    it("should create a form with correct attributes", () => {
      const options: CodePenOptions = { "slug-hash": "abc" };
      const form = getForm(options as unknown as Parameters<typeof getForm>[0]);

      expect(form.tagName).toBe("FORM");
      expect(form.classList.contains("code-pen-embed-form")).toBeTruthy();
      expect(form.method).toBe("post");
      expect(form.style.display).toBe("none");
    });

    it("should append hidden inputs for options", () => {
      const options: CodePenOptions = { "slug-hash": "abc", "theme-id": "123" };
      const form = getForm(options as unknown as Parameters<typeof getForm>[0]);
      const inputs = form.querySelectorAll("input[type='hidden']");

      expect(inputs.length).toBe(2);
      expect((inputs[0] as HTMLInputElement).name).toBe("slug-hash");
      expect((inputs[0] as HTMLInputElement).value).toBe("abc");
    });

    it("should not append prefill key", () => {
      const options: CodePenOptions = { "slug-hash": "abc", prefill: { title: "Test" } };
      const form = getForm(options as unknown as Parameters<typeof getForm>[0]);
      const inputs = form.querySelectorAll("input[type='hidden']");

      expect(inputs.length).toBe(1);
      expect((inputs[0] as HTMLInputElement).name).toBe("slug-hash");
    });
  });

  describe("getIframe function", () => {
    it("should create an iframe with correct attributes", () => {
      const options: CodePenOptions = { "slug-hash": "abc", height: 500 };
      const iframe = getIframe(options as unknown as Parameters<typeof getIframe>[0]);

      expect(iframe.tagName).toBe("IFRAME");
      expect(iframe.height).toBe("500");
      expect(iframe.src).toContain("https://codepen.io/anon/embed/abc");
    });

    it("should create an iframe with correct attributes when prefill is present", () => {
      const options: CodePenOptions = { "slug-hash": "abc", height: 500, prefill: {} };
      const iframe = getIframe(options as unknown as Parameters<typeof getIframe>[0]);

      expect(iframe.tagName).toBe("IFRAME");
      expect(iframe.src).toBe("https://codepen.io/embed/prefill");
      expect(iframe.loading).toBeUndefined();
    });

    it("should create an iframe without id when no slug-hash", () => {
      const options: CodePenOptions = { height: 500, prefill: {} };
      const iframe = getIframe(options as unknown as Parameters<typeof getIframe>[0]);

      expect(iframe.tagName).toBe("IFRAME");
      expect(iframe.src).toBe("https://codepen.io/embed/prefill");
      expect(iframe.id).toBe("");
    });

    it("should create an iframe with id when slug-hash contains slash", () => {
      const options: CodePenOptions = { "slug-hash": "abc/def" };
      const iframe = getIframe(options as unknown as Parameters<typeof getIframe>[0]);

      expect(iframe.id).toBe("code-pen-embed-abc_def");
    });
  });

  describe("appendFragment function", () => {
    it("should append fragment to container", () => {
      const container = document.createElement("div");
      const fragment = document.createDocumentFragment();
      const child = document.createElement("span");
      fragment.append(child);

      appendFragment(container, fragment);
      expect(container.contains(child)).toBeTruthy();
    });

    it("should replace container with wrapper if it has parent", () => {
      const parent = document.createElement("div");
      const container = document.createElement("div");
      parent.append(container);
      const fragment = document.createDocumentFragment();

      const result = appendFragment(container, fragment);
      expect(result.className).toBe("code-pen-embed-wrapper");
      expect(parent.contains(result)).toBeTruthy();
      expect(parent.contains(container)).toBeFalsy();
    });
  });

  describe("loadCodePens function", () => {
    it("should call renderCodePens", () => {
      // This is a bit hard to test deeply without mocking the internal renderCodePens
      // but we can check if it adds event listener if loading
      const addSpy = vi.spyOn(document, "addEventListener");

      // Force loading state
      Object.defineProperty(document, "readyState", {
        get() {
          return "loading";
        },
        configurable: true,
      });

      loadCodePens();
      expect(addSpy).toHaveBeenCalledWith("DOMContentLoaded", expect.any(Function));

      // Trigger the event
      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);

      addSpy.mockRestore();
    });

    it("should render codepens directly if document is ready", () => {
      const container = document.createElement("div");
      container.className = "codepen";
      container.dataset.slugHash = "abc";
      document.body.append(container);

      loadCodePens();

      const wrapper = document.querySelector(".code-pen-embed-wrapper");
      expect(wrapper).toBeTruthy();
      const form = wrapper!.querySelector("form");
      expect(form).toBeNull();

      container.remove();
      wrapper?.remove();
    });
  });

  describe("openCodePens function", () => {
    it("should call loadCodePens with open: true", () => {
      const container = document.createElement("div");
      container.className = "codepen";
      container.dataset.slugHash = "abc";
      document.body.append(container);

      // Mock window.open since open: true will call it for non-prefill
      const openSpy = vi.spyOn(globalThis, "open").mockImplementation(() => null);

      openCodePens();

      expect(openSpy).toHaveBeenCalled();

      openSpy.mockRestore();
      container.remove();
    });

    it("should call form.submit for prefill", () => {
      const container = document.createElement("div");
      container.className = "codepen";
      container.dataset.prefill = encodeURI(JSON.stringify({ title: "My Pen" }));
      document.body.append(container);

      const submitSpy = vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(() => {});

      openCodePens();

      expect(submitSpy).toHaveBeenCalled();

      submitSpy.mockRestore();
      container.remove();
      const wrapper = document.querySelector(".code-pen-embed-wrapper");
      wrapper?.remove();
    });
  });

  describe("getDataFromDOM function", () => {
    it("should extract data from element with data-prefill", () => {
      const container = document.createElement("div");
      container.dataset.prefill = encodeURI(JSON.stringify({ title: "My Pen" }));

      const htmlElement = document.createElement("div");
      htmlElement.dataset.lang = "html";
      htmlElement.textContent = "<h1>Hello</h1>";
      container.append(htmlElement);

      const jsElement = document.createElement("div");
      jsElement.dataset.lang = "typescript";
      jsElement.dataset.langVersion = "5.0";
      jsElement.textContent = "const x = 1;";
      container.append(jsElement);

      const cssElement = document.createElement("div");
      cssElement.dataset.lang = "css";
      cssElement.dataset.optionsAutoprefixer = "";
      cssElement.textContent = "body { color: red; }";
      container.append(cssElement);

      loadCodePens(".prefill-test", { prefill: {} });
      // We need to trigger it somehow, but loadCodePens uses querySelectorAll so we should add to body
      container.className = "prefill-test";
      document.body.append(container);

      loadCodePens(".prefill-test");

      const wrapper = document.querySelector(".code-pen-embed-wrapper");
      expect(wrapper).toBeTruthy();
      const form = wrapper!.querySelector("form");
      expect(form).toBeTruthy();
      const dataInput = form!.querySelector('input[name="data"]')!;
      const data = JSON.parse((dataInput as HTMLInputElement).value) as Record<string, unknown>;
      expect(data.title).toBe("My Pen");
      expect(data.html).toBe("<h1>Hello</h1>");
      expect(data.js).toBe("const x = 1;");
      expect(data.js_pre_processor).toBe("typescript");
      expect(data.js_version).toBe("5.0");
      expect(data.css).toBe("body { color: red; }");
      expect(data.css_prefix).toBe("autoprefixer");

      wrapper?.remove();
    });
  });
});
