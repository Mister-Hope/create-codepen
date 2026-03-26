import { defaultIgnorePatterns, getOxlintConfigs } from "oxc-config-hope/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: getOxlintConfigs(),
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: defaultIgnorePatterns,
});
