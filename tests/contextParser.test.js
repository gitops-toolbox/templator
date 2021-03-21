const tap = require('tap');
const log = require('debug')('teeest');
const ContextParser = require('../lib/contextParser');
const { expectedContext, existingConfigDir } = require('./data');

tap.test('Context parser', (t) => {
  t.plan(3);
  t.test('When context is empty', (t) => {
    t.plan(1);
    t.test('Should return an error?', async (t) => {
      t.plan(1);
      const cp = new ContextParser(existingConfigDir, {
        contextDir: 'emptycontext',
      });
      t.same(await cp.context(), {});
    });
  });

  t.test('When loading a sparse context', (t) => {
    t.plan(1);
    t.test('Should return a parsed context', async (t) => {
      t.plan(1);
      const cp = new ContextParser(existingConfigDir, {
        contextDir: 'sparsecontext',
      });
      t.same(await cp.context(), {
        layer1: { layer2: { test: 'test' } },
      });
    });
  });

  t.test('When context is present', async (t) => {
    let cp;
    t.plan(4);

    t.beforeEach((done, t) => {
      t.context.cp = new ContextParser(existingConfigDir);
      done();
    });

    t.test('Should return an object merging all context files', async (t) => {
      t.plan(1);
      t.same(await t.context.cp.context(), expectedContext);
    });

    t.test('Should return a list of context files', (t) => {
      t.plan(1);
      t.same(t.context.cp.contextFiles, [
        'context/base.json',
        'context/development/context.json',
        'context/production/context.json',
        'context/staging/base.json',
        'context/staging/context.json',
        'context/development/components/base.json',
        'context/production/components/base.json',
        'context/staging/components/base.json',
      ]);
    });

    t.test('Should return a selection of the context', async (t) => {
      t.plan(6);

      t.same(
        await t.context.cp.fromSelector('development'),
        expectedContext.development
      );

      t.same(
        await t.context.cp.fromSelector('development.components'),
        expectedContext.development.components
      );

      t.same(
        await t.context.cp.fromSelector(['development', 'components']),
        expectedContext.development.components
      );

      t.same(
        await t.context.cp.fromSelector({
          base: 'development.components.database',
          assign: [expectedContext],
        }),
        {
          ...expectedContext.development.components.database,
          ...expectedContext,
        }
      );

      t.same(
        await t.context.cp.fromSelector({
          base: 'development',
          assign: ['staging'],
        }),
        {
          environment: 'staging',
          components: {
            application: {
              replicas: 3,
            },
          },
        }
      );

      t.same(
        await t.context.cp.fromSelector({
          base: 'development',
          mergeWith: ['staging'],
        }),
        {
          environment: 'staging',
          components: {
            database: {
              size: 5,
            },
            application: {
              replicas: 3,
            },
          },
        }
      );
    });

    t.test('Should virtually support any lodash method', async (t) => {
      t.plan(1);

      t.same(
        await t.context.cp.fromSelector({
          base: 'development',
          defaultsDeep: ['staging'],
        }),
        {
          components: {
            application: {
              replicas: 3,
            },
            database: {
              size: 5,
            },
          },
          environment: 'development',
        }
      );
    });
  });
});
