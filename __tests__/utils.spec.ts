import { describe, expect, it } from "vitest";
import { createElement } from "../src/utils.js";

describe(createElement, () => {
  it("should create element with given tag name", () => {
    const div = createElement("div", {});
    expect(div.tagName).toBe("DIV");
  });

  it("should set attributes correctly", () => {
    const input = createElement("input", {
      type: "hidden",
      name: "data",
      value: "some-value",
    });
    expect(input.getAttribute("type")).toBe("hidden");
    expect(input.getAttribute("name")).toBe("data");
    expect(input.getAttribute("value")).toBe("some-value");
  });

  it("should handle numeric attributes", () => {
    const div = createElement("div", {
      "data-id": 123,
    });
    expect(div.dataset.id).toBe("123");
  });
});
