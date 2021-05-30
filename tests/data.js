const path = require('path');

exports.expectedContext = {
  development: {
    environment: 'development',
    components: {
      database: {
        size: 5,
      },
    },
  },
  production: {
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
  staging: {
    environment: 'staging',
    components: {
      application: {
        replicas: 3,
      },
    },
  },
};

exports.existingConfigDir = path.resolve(
  process.cwd(),
  './tests/fixtures/base'
);
