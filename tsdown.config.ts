import { codecovRollupPlugin } from "@codecov/rollup-plugin";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  outDir: "./dist",
  dts: true,
  plugins: [
    codecovRollupPlugin({
      enableBundleAnalysis: Boolean(process.env.BUNDLE_ANALYSIS),
      bundleName: "create-codepen",
      oidc: {
        useGitHubOIDC: true,
      },
      telemetry: false,
    }),
  ],
  target: "baseline-widely-available",
  platform: "browser",
  fixedExtension: false,
  minify: true,
  sourcemap: true,
});
