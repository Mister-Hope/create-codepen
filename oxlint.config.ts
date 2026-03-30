import { defineConfig, defaultIgnorePatterns, getOxlintConfigs } from "oxc-config-hope/oxlint";

export default defineConfig({
  extends: getOxlintConfigs(),
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: defaultIgnorePatterns,
});
