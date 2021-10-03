const Templator = require('../lib/templator');
const tap = require('tap');
const { existingConfigDir } = require('./data');

tap.test('Given a destination template and a context', (t) => {
  t.plan(4);

  t.beforeEach((t) => {
    t.context.tr = new Templator(existingConfigDir);
  });

  t.test(
    'Should return components template rendered for development',
    async (t) => {
      t.plan(1);

      t.strictSame(await t.context.tr.render('components.js', 'development'), {
        locations: [
          {
            template: 'components/database.njk',
            contextSelector: 'components.database',
            destination: {},
            renderedTemplate: 'size: 5\n',
            tags: {},
          },
        ],
      });
    }
  );

  t.test(
    'Should return components mapping rendered for production',
    async (t) => {
      t.plan(1);

      t.strictSame(
        await t.context.tr.renderMapping('components.js', 'production'),
        {
          mapping: {
            locations: [
              {
                template: 'components/application.njk',
                contextSelector: 'components.application',
                destination: {},
                tags: {},
              },
              {
                template: 'components/database.njk',
                contextSelector: 'components.database',
                destination: {},
                tags: {},
              },
            ],
          },
          context: {
            environment: 'production',
            components: {
              application: {
                replicas: 5,
              },
              database: {
                size: 20,
              },
            },
          },
        }
      );
    }
  );

  t.test(
    'Should return components template rendered for production',
    async (t) => {
      t.plan(1);

      t.strictSame(await t.context.tr.render('components.js', 'production'), {
        locations: [
          {
            template: 'components/application.njk',
            contextSelector: 'components.application',
            destination: {},
            renderedTemplate: 'replication: 5\n',
            tags: {},
          },
          {
            template: 'components/database.njk',
            contextSelector: 'components.database',
            destination: {},
            renderedTemplate: 'size: 20\n',
            tags: {},
          },
        ],
      });
    }
  );

  t.test(
    'Should error if mapping does not have contextSelector or template',
    async (t) => {
      t.plan(2);
      const expectedError = new Error(
        'Each location should have a contextSelector and a template'
      );
      t.rejects(
        t.context.tr.render('no_template.js', 'production'),
        expectedError
      );
      t.rejects(
        t.context.tr.render('no_contextSelector.js', 'production'),
        expectedError
      );
    }
  );
});
