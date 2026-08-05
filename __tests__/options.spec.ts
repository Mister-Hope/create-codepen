import { describe, expect, it } from "vitest";

import { getOptionsFromDom } from "../src/options.js";

describe(getOptionsFromDom, () => {
  it("should extract options from data attributes", () => {
    const div = document.createElement("div");

    div.dataset.slugHash = "abc";
    div.dataset.themeId = "123";
    div.dataset.user = "test-user";

    const options = getOptionsFromDom(div);
    expect(options).toStrictEqual({
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

  it("should extract user from nested anchor tags (real CodePen markup)", () => {
    const div = document.createElement("div");
    div.dataset.slugHash = "abc";
    div.innerHTML =
      '<span>See the Pen <a href="https://codepen.io/real-user/pen/abc">X</a> by Author ' +
      '(<a href="https://codepen.io/real-user">@real-user</a>) on ' +
      '<a href="https://codepen.io">CodePen</a>.</span>';

    const options = getOptionsFromDom(div);
    expect(options?.user).toBe("real-user");
  });

  it("should prefer data-user attribute over anchor link", () => {
    const div = document.createElement("div");
    div.dataset.slugHash = "abc";
    div.dataset.user = "from-data";
    div.innerHTML = '<a href="https://codepen.io/from-link/pen/abc"></a>';

    const options = getOptionsFromDom(div);
    expect(options?.user).toBe("from-data");
  });

  it("should default user to 'anon' when no pen link is found", () => {
    const div = document.createElement("div");
    div.dataset.slugHash = "abc";
    div.innerHTML =
      '<span><a href="https://codepen.io">CodePen</a> ' +
      '<a href="https://codepen.io/user">@user</a> ' +
      "<a>no href</a></span>";

    const options = getOptionsFromDom(div);
    expect(options?.user).toBe("anon");
  });

  it("should default user to 'anon' if not found", () => {
    const div = document.createElement("div");
    div.dataset.slugHash = "abc";

    const options = getOptionsFromDom(div);
    expect(options?.user).toBe("anon");
  });
});
