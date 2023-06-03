const HTML_TYPES = [
  "html",
  "xml",
  "haml",
  "markdown",
  "slim",
  "pug",
  "application/x-slim",
];

const CSS_TYPES = [
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
];

const JS_TYPES = [
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
];

const CUSTOM_EDITOR_TYPES: Record<string, string> = {
  vue: "js",
  flutter: "js",
};

export const getType = (type = ""): string =>
  HTML_TYPES.includes(type)
    ? "html"
    : CSS_TYPES.includes(type)
    ? "css"
    : JS_TYPES.includes(type)
    ? "js"
    : CUSTOM_EDITOR_TYPES[type]
    ? CUSTOM_EDITOR_TYPES[type]
    : "unknown";
