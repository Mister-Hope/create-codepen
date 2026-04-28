import { describe, expect, it, vi } from "vitest";

import { appendFragment, getForm, getIframe, loadCodePens, openCodePens } from "../src/dom.js";
import type { CodePenOptions } from "../src/options.js";

describe("getForm function", () => {
  it("should create a form with correct attributes", () => {
    const options: CodePenOptions = { "slug-hash": "abc" };
    const form = getForm(options as unknown as Parameters<typeof getForm>[0]);

    expect(form.tagName).toBe("FORM");
    expect(form.classList.contains("code-pen-embed-form")).toBe(true);
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
    expect(container.contains(child)).toBe(true);
  });

  it("should replace container with wrapper if it has parent", () => {
    const parent = document.createElement("div");
    const container = document.createElement("div");
    parent.append(container);
    const fragment = document.createDocumentFragment();

    const result = appendFragment(container, fragment);
    expect(result.className).toBe("code-pen-embed-wrapper");
    expect(parent.contains(result)).toBe(true);
    expect(parent.contains(container)).toBe(false);
  });
});

describe("loadCodePens function", () => {
  it("should call renderCodePens on DOMContentLoaded when document is loading", () => {
    const addSpy = vi.spyOn(document, "addEventListener");

    Object.defineProperty(document, "readyState", {
      get() {
        return "loading";
      },
      configurable: true,
    });

    loadCodePens();
    expect(addSpy).toHaveBeenCalledWith("DOMContentLoaded", expect.any(Function));

    document.dispatchEvent(new Event("DOMContentLoaded"));

    addSpy.mockRestore();

    // Restore readyState so later tests see "complete"
    Object.defineProperty(document, "readyState", {
      get() {
        return "complete";
      },
      configurable: true,
    });
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
  it("should call window.open for non-prefill embeds", () => {
    document.body.innerHTML = "";

    const container = document.createElement("div");
    container.className = "codepen";
    container.dataset.slugHash = "abc";
    document.body.append(container);

    const openSpy = vi.spyOn(globalThis, "open").mockImplementation(() => null);

    openCodePens();

    expect(openSpy).toHaveBeenCalled();

    openSpy.mockRestore();
    container.remove();
  });

  it("should call form.submit for prefill", () => {
    document.body.innerHTML = "";

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
  it("should extract data from children with data-prefill", () => {
    document.body.innerHTML = "";

    const container = document.createElement("div");
    container.className = "prefill-test";
    container.dataset.prefill = encodeURI(JSON.stringify({ title: "My Pen", notAllowed: "value" }));

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

    document.body.append(container);

    loadCodePens(".prefill-test", { prefill: {} });

    const wrapper = document.querySelector(".code-pen-embed-wrapper");
    expect(wrapper).toBeTruthy();
    const form = wrapper!.querySelector("form");
    expect(form).toBeTruthy();
    const dataInput = form!.querySelector('input[name="data"]')!;
    const data = JSON.parse((dataInput as HTMLInputElement).value) as Record<string, unknown>;

    expect(data).toMatchObject({
      title: "My Pen",
      html: "<h1>Hello</h1>",
      js: "const x = 1;",
      js_pre_processor: "typescript",
      js_version: "5.0",
      css: "body { color: red; }",
      css_prefix: "autoprefixer",
    });
  });

  it("should handle empty data-prefill attribute", () => {
    document.body.innerHTML = "";

    const container = document.createElement("div");
    container.className = "test-empty-prefill";
    container.dataset.prefill = "";
    document.body.append(container);

    loadCodePens(".test-empty-prefill");

    const wrapper = document.querySelector(".code-pen-embed-wrapper");
    expect(wrapper).toBeTruthy();
    const form = wrapper!.querySelector("form");
    expect(form).toBeTruthy();
    const dataInput = form!.querySelector<HTMLInputElement>('input[name="data"]');
    expect(dataInput).not.toBeNull();
    expect(dataInput!.value).toBe("{}");
  });

  it("should return undefined when container has no data-prefill attribute", () => {
    document.body.innerHTML = "";

    const container = document.createElement("div");
    container.className = "test-no-data-prefill";
    container.dataset.slugHash = "abc";
    document.body.append(container);

    const submitSpy = vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(() => {});

    loadCodePens(".test-no-data-prefill", { prefill: {} });

    const wrapper = document.querySelector(".code-pen-embed-wrapper");
    expect(wrapper).toBeTruthy();
    const form = wrapper!.querySelector("form");
    expect(form).toBeTruthy();
    const dataInput = form!.querySelector('input[name="data"]');
    expect(dataInput).toBeNull();

    submitSpy.mockRestore();
  });

  it("should not call submit for open=true when container has no data-prefill", () => {
    document.body.innerHTML = "";

    const container = document.createElement("div");
    container.className = "test-open-no-data-prefill";
    container.dataset.slugHash = "abc";
    document.body.append(container);

    const submitSpy = vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(() => {});

    loadCodePens(".test-open-no-data-prefill", { open: "true", prefill: {} });

    expect(submitSpy).toHaveBeenCalled();

    submitSpy.mockRestore();
  });
});
