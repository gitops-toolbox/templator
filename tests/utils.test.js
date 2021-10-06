const tap = require('tap');
const data = require('./data');
const path = require('path');
const utils = require('../lib/utils');

tap.test('Utils', async (t) => {
  t.plan(5);

  t.test('tryJSONParse should return json', async (t) => {
    t.plan(1);
    t.strictSame(utils.tryJSONParse('["test",1,2]'), ['test', 1, 2]);
  });

  t.test('tryJSONParse should return a string', async (t) => {
    t.plan(1);
    t.strictSame(utils.tryJSONParse('not json'), 'not json');
  });

  t.test('parse yml file', (t) => {
    t.plan(1);
    const result = utils.loadJsonOrYaml(
      path.resolve(data.existingConfigDir, 'context/staging/context.yml')
    );
    t.strictSame(result, { environment: 'staging' });
  });

  t.test('parse yaml file', (t) => {
    t.plan(1);
    const result = utils.loadJsonOrYaml(
      path.resolve(data.existingConfigDir, 'context/production/context.yaml')
    );

    t.strictSame(result, {
      environment: 'production',
      components: {
        application: {
          replicas: 5,
        },
      },
    });
  });

  t.test('parse non supported file', (t) => {
    t.plan(1);
    const result = utils.loadJsonOrYaml(
      path.resolve(data.existingConfigDir, 'context/non_supported.txt')
    );

    t.strictSame(result, {});
  });
});
