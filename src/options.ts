export interface CodePenStyleOptions {
  /**
   * @default 300
   */
  height?: number | string;

  /**
   * @default "none"
   */
  border?: "none" | "thin" | "thick";

  /**
   * @default "#000000"
   */
  "border-color"?: string;

  /**
   * @default "#3d3d3e"
   */
  "tab-bar-color"?: string;

  /**
   * @default "#76daff"
   */
  "tab-link-color"?: string;

  /**
   * @default "#cccccc"
   */
  "active-tab-color"?: string;

  /**
   * @default "#000000"
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

  /**
   * Custom css link
   */
  "custom-css-url"?: string;
}

export interface CodePenDomOptions extends CodePenStyleOptions, Record<string, unknown> {
  /**
   * Id of theme
   *
   * @default 0
   */
  "theme-id"?: string | number;

  "slug-hash"?: string;

  user?: string;

  /**
   * @description one of or a set of "html" | "css" | "js" | "result"
   *
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
}

export interface CodePenPrefillOptions {
  title?: string;
  description?: string;
  head?: string;
  tags?: string | string[];

  html_classes?: string | string[];
  stylesheets?: string | string[];
  scripts?: string | string[];
}

export interface CodePenOptions extends CodePenDomOptions {
  prefill?: CodePenPrefillOptions;

  /**
   * @default "false"
   */
  editable?: "true" | "false";
}

const getUserFromDom = (result: CodePenDomOptions, container: HTMLElement): string => {
  if (typeof result.user === "string") return result.user;

  // try to find a link in users
  for (const child of container.children) {
    const link = /codepen\.(io|dev)\/([\w-]+)\/pen\//i.exec(
      (child as HTMLAnchorElement).href || "",
    );

    if (link) return link[2];
  }

  return "anon";
};

export const getOptionsFromDom = (container: HTMLElement): CodePenDomOptions | null => {
  const { attributes } = container;
  const result: CodePenDomOptions = {};

  for (const { name, value } of attributes) {
    if (name.startsWith("data-")) result[name.replace("data-", "")] = value;
  }

  if ("prefill" in result || result["slug-hash"]) {
    result.user = getUserFromDom(result, container);

    return result;
  }

  return null;
};
