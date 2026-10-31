import { describe, expect, it } from "vitest";

import type { CodePenDomOptions } from "../src/options.js";
import { getPostLink } from "../src/postlink.js";

describe(getPostLink, () => {
  it("should return prefill link when prefill is present", () => {
    expect(getPostLink({ prefill: {} })).toBe("https://codepen.io/embed/prefill");
    expect(getPostLink({ prefill: {}, preview: "true" })).toBe(
      "https://codepen.io/embed/preview/prefill",
    );
  });

  it("should throw error if slug-hash is missing and not prefill", () => {
    expect(() => getPostLink({})).toThrow("slug-hash is required");
  });

  it("should return correct link for normal pen", () => {
    expect(getPostLink({ "slug-hash": "abc" })).toBe(
      "https://codepen.io/anon/embed/abc?slug-hash=abc",
    );
    expect(getPostLink({ "slug-hash": "abc", user: "mister-hope" })).toBe(
      "https://codepen.io/mister-hope/embed/abc?slug-hash=abc&user=mister-hope",
    );
  });

  it("should include token in slug-hash if present", () => {
    expect(getPostLink({ "slug-hash": "abc", token: "token123" })).toBe(
      "https://codepen.io/anon/embed/abc/token123?slug-hash=abc&token=token123",
    );
  });

  it("should use preview path if preview is true", () => {
    expect(getPostLink({ "slug-hash": "abc", preview: "true" })).toBe(
      "https://codepen.io/anon/embed/preview/abc?slug-hash=abc&preview=true",
    );
  });

  it("should encode options correctly", () => {
    const link = getPostLink({
      "slug-hash": "abc",
      "theme-id": 123,
      "default-tab": "js,result",
    });
    expect(link).toContain("theme-id=123");
    expect(link).toContain("default-tab=js%2Cresult");
  });

  it("should encode user and token path segments", () => {
    const userLink = getPostLink({ "slug-hash": "abc", user: "a b/c" });

    expect(userLink).toContain("https://codepen.io/a%20b%2Fc/embed/abc?");
    expect(userLink).not.toContain("https://codepen.io/a b/c/embed");

    const tokenLink = getPostLink({ "slug-hash": "abc", token: "t/1" });

    expect(tokenLink).toContain("/embed/abc/t%2F1?");
  });

  it("should fall back to anon for an empty or whitespace-only user", () => {
    expect(getPostLink({ "slug-hash": "abc", user: "" })).toMatch(
      /^https:\/\/codepen\.io\/anon\/embed\/abc\?/u,
    );
    expect(getPostLink({ "slug-hash": "abc", user: "   " })).toMatch(
      /^https:\/\/codepen\.io\/anon\/embed\/abc\?/u,
    );
  });

  it("should skip nullish and non-primitive options", () => {
    const options = {
      "slug-hash": "abc",
      "theme-id": undefined,
      height: null,
      extra: { foo: "bar" },
    } as unknown as CodePenDomOptions;

    expect(getPostLink(options)).toBe("https://codepen.io/anon/embed/abc?slug-hash=abc");
  });

  it("should not serialize inherited options", () => {
    const options = Object.create({ height: 100 }) as CodePenDomOptions;

    options["slug-hash"] = "abc";

    expect(getPostLink(options)).toBe("https://codepen.io/anon/embed/abc?slug-hash=abc");
  });

  it("should not serialize internal option keys", () => {
    expect(getPostLink({ "slug-hash": "abc", data: "{}", name: "_blank", open: "true" })).toBe(
      "https://codepen.io/anon/embed/abc?slug-hash=abc",
    );
  });
});
