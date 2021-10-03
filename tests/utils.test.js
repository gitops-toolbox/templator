const tap = require('tap');
const utils = require('../lib/utils');

tap.test('Utils', async (t) => {
  t.plan(2);

  t.test('tryJSONParse should return json', async (t) => {
    t.plan(1);
    t.strictSame(utils.tryJSONParse('["test",1,2]'), ['test', 1, 2]);
  });

  t.test('tryJSONParse should return a string', async (t) => {
    t.plan(1);
    t.strictSame(utils.tryJSONParse('not json'), 'not json');
  });
});
