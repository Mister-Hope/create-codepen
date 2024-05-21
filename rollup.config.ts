import dts from "rollup-plugin-dts";
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
    plugins: [esbuild({ minify: true, target: "node18" })],
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
