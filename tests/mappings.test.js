const tap = require('tap');
const Mappings = require('../lib/mappings');
const { existingConfigDir } = require('./data');
const context = { 1: 1 };

tap.test('Render template', async (t) => {
  t.plan(5);

  t.beforeEach((t) => {
    t.context.ms = new Mappings(existingConfigDir);
  });

  t.test('Should throw if no render function is available', async (t) => {
    t.plan(1);
    t.rejects(
      t.context.ms.render('noRender.js', context),
      'does not have a render function'
    );
  });

  t.test('Should throw if js file cannot be required', async (t) => {
    t.plan(1);
    t.rejects(t.context.ms.render('text_file.js', context));
  });

  t.test('Should return a valid mapping', async (t) => {
    t.plan(1);
    t.same(await t.context.ms.render('render.js', context), {
      locations: [
        {
          template: 'templates/1',
          contextSelector: '1',
          tags: {},
          destinations: [],
        },
      ],
    });
  });

  t.test('Should return an invalid json', async (t) => {
    t.plan(1);
    t.rejects(
      t.context.ms.render('no_json.njk', context),
      new Error('Failed to render no_json.njk, invalid json found')
    );
  });

  t.test('Should return a valid mapping', async (t) => {
    t.plan(1);
    t.same(await t.context.ms.render('render.njk', context), {
      locations: [
        {
          template: 'templates/1',
          contextSelector: '1',
          tags: {},
          destinations: [],
        },
      ],
    });
  });
});
