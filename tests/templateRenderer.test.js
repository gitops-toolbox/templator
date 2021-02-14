const TemplateRenderer = require('../lib/templateRenderer');
const existing_config_dir = './tests/fixtures/base';
const context = {1:1};

describe("Render template", () => {
  test('Should return the stringified context', () => {
    const tr = new TemplateRenderer(existing_config_dir);
    expect(tr.render('dump.njk', context)).toBe(JSON.stringify(context, null, 2));
  });

  test('Should load template from different folder', () => {
    const tr = new TemplateRenderer(existing_config_dir, {templatesDir: 'tmplts'});
    expect(tr.render('dumps.njk', context)).toBe(JSON.stringify(context, null, 2));
  })
});
