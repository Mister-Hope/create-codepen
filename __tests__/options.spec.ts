import { describe, expect, it } from "vitest";
import { getOptionsFromDom } from "../src/options.js";

describe(getOptionsFromDom, () => {
  it("should extract options from data attributes", () => {
    const div = document.createElement("div");

    div.dataset.slugHash = "abc";
    div.dataset.themeId = "123";
    div.dataset.user = "test-user";

    const options = getOptionsFromDom(div);
    expect(options).toEqual({
      "slug-hash": "abc",
      "theme-id": "123",
      user: "test-user",
    });
  });

  it("should return null if no valid options found", () => {
    const div = document.createElement("div");
    expect(getOptionsFromDom(div)).toBeNull();
  });

  it("should extract user from anchor tags if not in data attribute", () => {
    const div = document.createElement("div");
    div.dataset.slugHash = "abc";
    div.innerHTML = '<a href="https://codepen.io/real-user/pen/abc"></a>';

    const options = getOptionsFromDom(div);
    expect(options?.user).toBe("real-user");
  });

  it("should default user to 'anon' if not found", () => {
    const div = document.createElement("div");
    div.dataset.slugHash = "abc";

    const options = getOptionsFromDom(div);
    expect(options?.user).toBe("anon");
  });
});
