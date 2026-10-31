import type { CodePenDomOptions } from "./options.js";
import { isTrue } from "./utils.js";

const HOST = "https://codepen.io";

const encodeOptions = (options: CodePenDomOptions): string => {
  let result = "";

  for (const key in options) {
    if (key !== "prefill" && key !== "open" && key !== "name") {
      if (result !== "") result += "&";

      result += `${key}=${encodeURIComponent(options[key] as string | number | boolean)}`;
    }
  }

  return result;
};

const encodePathSegment = (value: string): string => encodeURIComponent(value);

export const getPostLink = (options: CodePenDomOptions): string => {
  const path = isTrue(options.preview) ? "embed/preview" : "embed";

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
