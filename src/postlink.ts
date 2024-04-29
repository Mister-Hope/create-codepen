import type { CodePenDomOptions } from "./options.js";

const HOST = "https://codepen.io";

const encodeOptions = (options: CodePenDomOptions): string => {
  let result = "";

  for (const key in options)
    if (key !== "prefill" && key !== "open") {
      if (result !== "") result += "&";

      result += `${key}=${encodeURIComponent(
        options[key] as string | number | boolean,
      )}`;
    }

  return result;
};

export const getPostLink = (options: CodePenDomOptions): string => {
  const path = options.preview === "true" ? "embed/preview" : "embed";

  if ("prefill" in options) return [HOST, path, "prefill"].join("/");

  let slugHash = options["slug-hash"];

  if (!slugHash) throw new Error("slug-hash is required");

  if (options.token) slugHash += "/" + options.token;

  return [
    HOST,
    options.user ?? "anon",
    path,
    slugHash + "?" + encodeOptions(options),
  ]
    .join("/")
    .replace(/\/\//g, "//");
};
