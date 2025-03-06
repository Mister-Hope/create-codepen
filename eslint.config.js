import { hope } from "eslint-config-mister-hope";

export default hope({
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
});
