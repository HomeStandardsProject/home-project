module.exports = {
  env: {
    es2020: true,
  },
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect",
    },
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  plugins: [
    "react",
    "@typescript-eslint",
    "prettier",
    "unused-imports",
    "import",
  ],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "_" }],

    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],

    "no-await-in-loop": "off",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-console": "off",
    "no-continue": "off",
    "no-restricted-syntax": "off",
    "no-use-before-define": "off",
    "max-classes-per-file": "off",
    "no-underscore-dangle": "off",
    "vars-on-top": "off",
    "no-shadow": "off",
    "no-unused-vars": "off",

    "prettier/prettier": "error",

    "react/prop-types": "off",
    "react/display-name": "off",

    "unused-imports/no-unused-imports": "error",
  },
  overrides: [
    {
      files: ["api-functions/cms/codegen/**/*"],
      rules: {
        camelcase: "off",
      },
    },
  ],
};
