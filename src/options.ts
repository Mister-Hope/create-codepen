/* eslint-disable @typescript-eslint/naming-convention */
export interface CodePenStyleOptions {
  /**
   * @default 300
   */
  height?: number | string;

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

  /**
   * Additional class name
   */
  class?: string;

  "custom-css-url"?: string;
}

export interface CodePenDomOptions
  extends CodePenStyleOptions,
    Record<string, unknown> {
  /**
   * Id of theme
   * @default 0
   */
  "theme-id"?: string | number;

  "slug-hash"?: string;

  user?: string;

  /**
   * @description one of or a set of "html" | "css" | "js" | "result"
   * @default "result"
   */
  "default-tab"?: string;

  animations?: "run" | "stop-after-5";

  preview?: "true" | "false";

  /**
   * @default 1
   */
  zoom?: 1 | 0.5 | 0.25;

  token?: string;

  "pen-title"?: string;

  /**
   * @default "false"
   */
  open?: "true" | "false";

  /**
   * @deprecated use "slug-hash" instead
   */
  href?: string;
  /**
   * @deprecated use "animations" instead
   */
  safe?: "true";
  /**
   * @deprecated use "default-tab" instead
   */
  type?: string;

  /** @private */
  name?: string;
}

export interface CodePenPrefillOptions {
  title?: string;
  description?: string;
  head?: string;
  tags?: string | string[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  html_classes?: string | string[];
  stylesheets?: string | string[];
  scripts?: string | string[];
}

export interface CodePenOptions
  extends Omit<CodePenDomOptions, "name" | "type" | "href" | "safe"> {
  /** @private */
  data?: string;
  prefill?: CodePenPrefillOptions;

  /**
   * @default "false"
   */
  editable?: "true" | "false";
}

const getUserFromDom = (
  result: CodePenDomOptions,
  container: HTMLElement,
): string => {
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
  container: HTMLElement,
): CodePenDomOptions | null => {
  const { attributes } = container;
  const result: CodePenDomOptions = {};

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
