const MappingRenderer = require('../lib/mappingRenderer');
const tap = require('tap');
const existingConfigDir = './tests/fixtures/base';
const context = { 1: 1 };

tap.test('Render template', (t) => {
  t.plan(3);
  t.test('Should throw because no render function is available', async (t) => {
    t.plan(1);
    const tr = new MappingRenderer(existingConfigDir);
    t.rejects(
      tr.render('noRender.js', context),
      'does not have a render function'
    );
  });

  t.test('Should return the context', async (t) => {
    t.plan(1);
    const tr = new MappingRenderer(existingConfigDir);
    t.equal(await tr.render('render.js', context), context);
  });

  t.test('Should return the context', async (t) => {
    t.plan(1);
    const tr = new MappingRenderer(existingConfigDir);
    t.same(await tr.render('render.njk', context), context);
  });
});
