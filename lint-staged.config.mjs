// lint-staged.config.mjs
export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix --max-warnings 0'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
