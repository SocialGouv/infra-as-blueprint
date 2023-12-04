module.exports = {
  env: {
    node: true,
    es2023: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  rules: {
    "no-unused-vars": "off",
    "prettier/prettier": [
      "error",
      {
        semi: false,
      },
    ],
  },
  ignorePatterns: [
    "!.versionrc.js",
    "!.foundernetesrc.js",
    "**/dist/**",
    "**/build/**",
    ".cjs",
  ],
}
