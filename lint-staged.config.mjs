// lint-staged.config.mjs
export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix --no-warn-ignored'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
