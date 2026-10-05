import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const effectMessage =
  "No effects. Fetch with TanStack Query/Router loaders, subscribe with useSyncExternalStore, " +
  "react to DOM nodes with ref callbacks, and react to events in event handlers.";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // noUncheckedIndexedAccess makes `!` an explicit, reviewed assertion
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["useEffect", "useLayoutEffect", "useInsertionEffect"],
              message: effectMessage,
            },
          ],
        },
      ],
      "no-restricted-properties": [
        "error",
        { object: "React", property: "useEffect", message: effectMessage },
        { object: "React", property: "useLayoutEffect", message: effectMessage },
        { object: "React", property: "useInsertionEffect", message: effectMessage },
      ],
    },
  },
);
