const ContextParser = require('../lib/contextParser');
const existing_config_dir = './tests/fixtures/base';
const expected_context = {
  development: {
    environment: "development",
    components: {
      database: {
        size: 5,
      },
    },
  },
  production: {
    environment: "production",
    components: {
      application: {
        replicas: 5,
      },
      database: {
        size: 20,
      },
    },
  },
  staging: {
    environment: "staging",
    components: {
      database: {
        size: 10,
      },
    },
  }
}

describe("Parse context", () => {
    test('Should return an object merging all context files', () => {
        const cp = new ContextParser(existing_config_dir);
        expect(cp.context).toMatchObject(expected_context);
    })
});
