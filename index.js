const contextParser = require('@gitops-toolbox/config-loader');
const { expectedContext } = require('./tests/data');
const _ = require('lodash');

cp = new contextParser('./tests/fixtures/base', { configDir: 'context' });

(async () => {
  console.log(
    await cp.fromSelector({
      base: 'development',
      mergeWith: ['.'],
    })
  );

  console.log(_.mergeWith(expectedContext.development, expectedContext));
})();
