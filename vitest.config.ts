import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.ts"],
      reporter: process.env.TEST_REPORT ? ["cobertura", "text"] : ["text", "html"],
    },
    ...(process.env.TEST_REPORT
      ? {
          reporters: ["junit"],
          outputFile: {
            junit: "coverage/test-report.junit.xml",
          },
        }
      : {}),
  },
});
