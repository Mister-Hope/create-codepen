export interface CodePenStyleOptions {
  /** @default 300 */
  height?: number | string;

  /** @default "none" */
  border?: "none" | "thin" | "thick";

  /** @default "#000000" */
  "border-color"?: string;

  /** @default "#3d3d3e" */
  "tab-bar-color"?: string;

  /** @default "#76daff" */
  "tab-link-color"?: string;

  /** @default "#cccccc" */
  "active-tab-color"?: string;

  /** @default "#000000" */
  "active-link-color"?: string;

  /** @default #ffffff */
  "link-logo-color"?: string;

  /** Additional class name */
  class?: string;

  /** Custom css link */
  "custom-css-url"?: string;
}

/**
 * Options accepted by `loadCodePens()`.
 *
 * Any additional `data-*` attribute on a container is passed through as an option and serialized
 * into the embed URL or prefill form, so misspelled attributes are forwarded verbatim. DOM
 * attributes are always strings, even for boolean-style options such as `open` and `preview`.
 */
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
   * One of or a set of "html" | "css" | "js" | "result"
   *
   * @default "result"
   */
  "default-tab"?: string;

  animations?: "run" | "stop-after-5";

  preview?: "true" | "false";

  /** @default 1 */
  zoom?: 1 | 0.5 | 0.25;

  token?: string;

  "pen-title"?: string;

  /** @default "false" */
  open?: "true" | "false";
}

export interface CodePenPrefillOptions {
  title?: string;
  description?: string;
  head?: string;
  tags?: string | string[];

  html?: string;
  css?: string;
  js?: string;
  html_pre_processor?: string;
  css_pre_processor?: string;
  js_pre_processor?: string;

  html_classes?: string | string[];
  stylesheets?: string | string[];
  scripts?: string | string[];
}

export interface CodePenOptions extends CodePenDomOptions {
  prefill?: CodePenPrefillOptions;

  /** @default "false" */
  editable?: "true" | "false";
}

const getUserFromDom = (result: CodePenDomOptions, container: HTMLElement): string => {
  if (typeof result.user === "string" && result.user.trim()) return result.user;

  const slugHash = result["slug-hash"];
  let fallbackUser: string | undefined;

  // try to find a link in users; prefer the link that points at this pen
  for (const anchor of container.querySelectorAll("a")) {
    // oxlint-disable-next-line prefer-named-capture-group
    const link = /codepen\.(?:io|dev)\/([\w-]+)\/pen\/([\w-]+)/iu.exec(anchor.href || "");

    if (link) {
      if (slugHash && link[2] === slugHash) return link[1];

      fallbackUser ??= link[1];
    }
  }

  return fallbackUser ?? "anon";
};

export const getOptionsFromDom = (container: HTMLElement): CodePenDomOptions | null => {
  const { attributes } = container;
  const result: CodePenDomOptions = {};

  for (const { name, value } of attributes)
    if (name.startsWith("data-")) result[name.replace("data-", "")] = value;

  // `prefill` is kept as the raw attribute string here; it is only used as a
  // marker by getPostLink/getIframe and parsed later by getDataFromDOM

  if ("prefill" in result || result["slug-hash"]) {
    result.user = getUserFromDom(result, container);

    return result;
  }

  return null;
};
