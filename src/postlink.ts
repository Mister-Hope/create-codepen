import type { CodePenDomOptions } from "./options.js";

const HOST = "https://codepen.io";

const INTERNAL_OPTION_KEYS = new Set(["prefill", "open", "name", "data"]);

const encodeOptions = (options: CodePenDomOptions): string => {
  const query: string[] = [];

  for (const key of Object.keys(options)) {
    if (INTERNAL_OPTION_KEYS.has(key)) continue;

    const value = options[key];

    // only primitive values can be serialized meaningfully; skip undefined,
    // null, objects and arrays instead of sending "undefined"/"[object Object]"
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean")
      continue;

    query.push(`${key}=${encodeURIComponent(value)}`);
  }

  return query.join("&");
};

const encodePathSegment = (value: string): string => encodeURIComponent(value);

export const getPostLink = (options: CodePenDomOptions): string => {
  const path = options.preview === "true" ? "embed/preview" : "embed";

  if ("prefill" in options) return [HOST, path, "prefill"].join("/");

  const { "slug-hash": slugHash, token } = options;

  if (!slugHash) throw new Error("slug-hash is required");

  let user = options.user?.trim() ?? "anon";

  if (user === "") user = "anon";
  const penPath = token
    ? `${encodePathSegment(slugHash)}/${encodePathSegment(token)}`
    : encodePathSegment(slugHash);

  return [HOST, encodePathSegment(user), path, `${penPath}?${encodeOptions(options)}`].join("/");
};
