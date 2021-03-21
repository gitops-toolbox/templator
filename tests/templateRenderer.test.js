const TemplateRenderer = require('../lib/templateRenderer');
const existingConfigDir = './tests/fixtures/base';
const tap = require('tap');
const context = { 1: 1 };

tap.test('Render template', (t) => {
  t.plan(2);
  t.test('Should return the stringified context', async (t) => {
    t.plan(1);
    const tr = new TemplateRenderer(existingConfigDir);
    t.same(
      await tr.render('dump.njk', context),
      JSON.stringify(context, null, 2)
    );
  });

  t.test('Should load template from different folder', async (t) => {
    t.plan(1);
    const tr = new TemplateRenderer(existingConfigDir, {
      templatesDir: 'tmplts',
    });
    t.same(
      await tr.render('dumps.njk', context),
      JSON.stringify(context, null, 2)
    );
  });
});
