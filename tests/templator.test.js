const Templator = require('../lib/templator');
const tap = require('tap');
const { existingConfigDir } = require('./data');

tap.test('Given a destination template and a context', (t) => {
  t.plan(2);
  t.test(
    'Should return components template rendered for development',
    async (t) => {
      t.plan(1);
      const tr = new Templator(existingConfigDir);
      t.same(await tr.render('components.js', 'development'), {
        locations: [
          {
            template: 'components/database.njk',
            contextSelector: 'components.database',
            destination: {},
            renderedTemplate: 'size: 5\n',
          },
        ],
      });
    }
  );

  t.test(
    'Should return components template rendered for production',
    async (t) => {
      t.plan(1);
      const tr = new Templator(existingConfigDir);
      t.same(await tr.render('components.js', 'production'), {
        locations: [
          {
            template: 'components/application.njk',
            contextSelector: 'components.application',
            destination: {},
            renderedTemplate: 'replication: 5\n',
          },
          {
            template: 'components/database.njk',
            contextSelector: 'components.database',
            destination: {},
            renderedTemplate: 'size: 20\n',
          },
        ],
      });
    }
  );
});
