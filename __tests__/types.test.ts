import { describe, expect, it } from "vitest";
import { getType } from "../src/types.js";

describe(getType, () => {
  it("should return 'html' for HTML types", () => {
    expect(getType("html")).toBe("html");
    expect(getType("xml")).toBe("html");
    expect(getType("markdown")).toBe("html");
    expect(getType("pug")).toBe("html");
  });

  it("should return 'css' for CSS types", () => {
    expect(getType("css")).toBe("css");
    expect(getType("less")).toBe("css");
    expect(getType("scss")).toBe("css");
    expect(getType("stylus")).toBe("css");
  });

  it("should return 'js' for JS types", () => {
    expect(getType("js")).toBe("js");
    expect(getType("javascript")).toBe("js");
    expect(getType("typescript")).toBe("js");
    expect(getType("babel")).toBe("js");
  });

  it("should return 'js' for custom editor types", () => {
    expect(getType("vue")).toBe("js");
    expect(getType("flutter")).toBe("js");
  });

  it("should return 'unknown' for unknown types", () => {
    expect(getType("unknown")).toBe("unknown");
    expect(getType("")).toBe("unknown");
  });
});
