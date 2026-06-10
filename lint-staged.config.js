export default {
    "src/**/*.ts": ["prettier --write", "eslint --fix"],

    "*.{json,md}": ["prettier --write"],
};
