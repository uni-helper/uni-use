/* eslint-disable no-template-curly-in-string */
module.exports = {
  'pre-commit': 'npx lint-staged',
  'commit-msg': 'npx commitlint --edit ${1}',
};
