import { dts } from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/index.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      esbuild({
        minify: true,
        target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
      }),
    ],
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/index.d.ts",
        format: "esm",
      },
    ],
    plugins: [dts()],
  },
];
