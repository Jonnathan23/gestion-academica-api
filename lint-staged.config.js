/** @type {import('lint-staged').Config} */
const lintStagedConfiguration = {
  "*.ts": [
    () => "bunx prettier --write",
    () => "bunx eslint --fix"
  ]
};

export default lintStagedConfiguration;