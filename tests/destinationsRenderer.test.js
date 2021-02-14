const destinationRenderer = require('../lib/destinationsRenderer');
const existing_config_dir = './tests/fixtures/base';
const context = {1:1};

describe("Render template", () => {
  test('Should throw because no render function is available', () => {
    const tr = new destinationRenderer(existing_config_dir);
    expect(() => tr.render('noRender.js', context)).toThrow('does not have a render function');
  });

  test('Should return the context', () => {
    const tr = new destinationRenderer(existing_config_dir);
    expect(tr.render('render.js', context)).toBe(context);
  });

  test('Should return the stringified context', () => {
    const tr = new destinationRenderer(existing_config_dir);
    expect(tr.render('render.njk', context)).toBe(JSON.stringify(context, null, 2));
  })

});
