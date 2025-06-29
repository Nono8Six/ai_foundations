// lint-staged.config.mjs
export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix --max-warnings 0 --no-warn-ignored'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
