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
  target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
  platform: "browser",
  fixedExtension: false,
  minify: true,
  sourcemap: true,
});
