const Templates = require('../lib/templates');
const { existingConfigDir } = require('./data');
const tap = require('tap');
const context = { 1: 1 };

tap.test('Render template', (t) => {
  t.plan(3);

  t.test('Should throw if base folder is not absolute', async (t) => {
    t.plan(1);
    t.throws(
      () => new Templates('./'),
      new Error('Base should be an absolute path')
    );
  });

  t.test('Should return the stringified context', async (t) => {
    t.plan(1);
    const tr = new Templates(existingConfigDir);

    t.same(
      await tr.render('dump.njk', context),
      JSON.stringify(context, null, 2)
    );
  });

  t.test('Should load template from different folder', async (t) => {
    t.plan(1);

    const tr = new Templates(existingConfigDir, {
      templatesDir: 'tmplts',
    });

    t.same(
      await tr.render('dumps.njk', context),
      JSON.stringify(context, null, 2)
    );
  });
});
