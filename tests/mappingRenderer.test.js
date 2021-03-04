const MappingRenderer = require('../lib/mappingRenderer');
const existingConfigDir = './tests/fixtures/base';
const context = {1: 1};

describe('Render template', () => {
  test('Should throw because no render function is available', () => {
    const tr = new MappingRenderer(existingConfigDir);
    expect(() => tr.render('noRender.js', context)).toThrow('does not have a render function');
  });

  test('Should return the context', () => {
    const tr = new MappingRenderer(existingConfigDir);
    expect(tr.render('render.js', context)).toStrictEqual(context);
  });

  test('Should return the context', () => {
    const tr = new MappingRenderer(existingConfigDir);
    expect(tr.render('render.njk', context)).toStrictEqual(context);
  });
});
