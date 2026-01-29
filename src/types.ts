const HTML_TYPES = new Set([
  "html",
  "xml",
  "haml",
  "markdown",
  "slim",
  "pug",
  "application/x-slim",
]);

const CSS_TYPES = new Set([
  "css",
  "less",
  "scss",
  "sass",
  "stylus",
  "postcss",
  "text/css",
  "text/x-sass",
  "text/x-scss",
  "text/x-less",
  "text/x-styl",
]);

const JS_TYPES = new Set([
  "js",
  "javascript",
  "coffeescript",
  "livescript",
  "typescript",
  "babel",
  "text/javascript",
  "text/x-coffeescript",
  "text/x-livescript",
  "text/typescript",
]);

const CUSTOM_EDITOR_TYPES: Record<string, string> = {
  vue: "js",
  flutter: "js",
};

export const getType = (type = ""): string =>
  HTML_TYPES.has(type)
    ? "html"
    : CSS_TYPES.has(type)
      ? "css"
      : JS_TYPES.has(type)
        ? "js"
        : CUSTOM_EDITOR_TYPES[type] || "unknown";
