export interface DomOptions extends Record<string, unknown> {
  /**
   * @default 0
   */
  "theme-id"?: string | number;

  "slug-hash"?: string;

  user?: string;

  name?: string;
  href?: string;
  /**
   * @description one of or a set of "html" | "css" | "js" | "result"
   * @default "result"
   */
  "default-tab"?: string;
  /**
   * @default 300
   */
  height?: number | string;
  animations?: "run" | "stop-after-5";
  /**
   * @default none
   */
  border?: "none" | "thin" | "thick";
  /**
   * @default #000000
   */
  "border-color"?: string;
  /**
   * @default #3d3d3e
   */
  "tab-bar-color"?: string;
  /**
   * @default #76daff
   */
  "tab-link-color"?: string;
  /**
   * @default #cccccc
   */
  "active-tab-color"?: string;
  /**
   * @default #000000
   */
  "active-link-color"?: string;
  /**
   * @default #ffffff
   */
  "link-logo-color"?: string;
  class?: string;
  "custom-css-url"?: string;
  preview?: "true" | "none";
  /**
   * @default 1
   */
  zoom?: 1 | 0.5 | 0.25;
  token?: string;
  "pen-title"?: string;

  /**
   * @deprecated use "animations" instead
   */
  safe?: "true";
  /**
   * @deprecated use "default-tab" instead
   */
  type?: string;
}

export interface PrefillOptions {
  title?: string;
  description?: string;
  head?: string;
  tags?: string | string[];
  html_classes?: string | string[];
  stylesheets?: string | string[];
  scripts?: string | string[];
}

export interface APIOptions extends DomOptions {
  /** @private */
  data?: string;
  prefill?: PrefillOptions;

  /**
   * @default "false"
   */
  editable?: "true" | "false";
}

const getUserFromDom = (result: DomOptions, container: HTMLElement): string => {
  if (typeof result.user === "string") return result.user;

  // try to find a link in users
  for (let index = 0; index < container.children.length; index++) {
    const link = (
      (<HTMLAnchorElement>container.children[index]).href || ""
    ).match(/codepen\.(io|dev)\/(\w+)\/pen\//i);

    if (link) return link[2];
  }

  return "anon";
};

export const getOptionsFromDom = (
  container: HTMLElement
): DomOptions | null => {
  const { attributes } = container;
  const result: DomOptions = {};

  for (let index = 0; index < attributes.length; index++) {
    const name = attributes[index].name;

    if (name.startsWith("data-"))
      result[name.replace("data-", "")] = attributes[index].value;
  }

  if (result.href) result["slug-hash"] = result.href;

  if (result.type) result["default-tab"] = result.type;
  if (result.safe)
    result.animations = result.safe === "true" ? "run" : "stop-after-5";

  if ("prefill" in result || result["slug-hash"]) {
    result.user = getUserFromDom(result, container);

    return result;
  }

  return null;
};
