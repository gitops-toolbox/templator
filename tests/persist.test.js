const tap = require('tap');
const EchoDestination = require('../lib/destinations/echo');

const persist = tap.mock('../lib/persist', {
  '../lib/destinations': {
    'test-destination': function (a, b, c) {
      return a;
    },
    echo: EchoDestination,
  },
});

tap.test('When persisting a mapping', async (t) => {
  tap.plan(1);

  t.test('Should return an error if destination throws', async (t) => {
    t.plan(1);
    const result = await persist(
      {
        locations: [
          {
            destination: {
              type: 'test-destination',
            },
          },
        ],
      },
      {}
    );

    t.strictSame(result, {
      'test-destination': 'destination.persist is not a function',
    });
  });

  t.test(
    'Should return an error if destination is not supported',
    async (t) => {
      t.plan(1);
      const result = await persist(
        {
          locations: [
            {
              destination: {
                type: 'non-destination',
              },
            },
          ],
        },
        {}
      );

      t.strictSame(result, {
        'non-destination': 'Destination not supported',
      });
    }
  );

  t.test(
    'Should run the persist method of the destination object and return results',
    async (t) => {
      t.plan(1);
      const result = await persist(
        {
          locations: [
            {
              destination: {
                type: 'echo',
              },
            },
          ],
        },
        {}
      );

      t.strictSame(result, {
        echo: {
          templates: [
            {
              destination: {
                type: 'echo',
              },
            },
          ],
        },
      });
    }
  );

  t.test('Should persist destinations by group', async (t) => {
    t.plan(1);
    const result = await persist(
      {
        locations: [
          {
            destination: {
              type: 'echo',
            },
            group: 'group1',
          },
          {
            destination: {
              type: 'echo',
            },
            group: 'group2',
          },
        ],
      },
      { groupBy: 'test' }
    );

    t.strictSame(result, {
      echo: {
        group1: {
          templates: [
            {
              destination: {
                type: 'echo',
              },
              group: 'group1',
            },
          ],
        },
        group2: {
          templates: [
            {
              destination: {
                type: 'echo',
              },
              group: 'group2',
            },
          ],
        },
      },
    });
  });
});
