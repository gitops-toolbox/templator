const _ = require('lodash');
const destinations = require('./destinations');
const [log, error] = require('./utils').getLogger(__filename);

module.exports = async function (mappings, args) {
  const templates_by_destinations = _.groupBy(
    mappings.locations,
    'destination.type'
  );

  const results = {};

  for (const [dest_type, templates] of Object.entries(
    templates_by_destinations
  )) {
    if (_.isUndefined(destinations[dest_type])) {
      log('Destination %s not supported', dest_type);
      results[dest_type] = 'Destination not supported';
      continue;
    }

    try {
      const destination = new destinations[dest_type](templates, log, args);
      results[dest_type] = await destination.persist();
    } catch (e) {
      results[dest_type] = e.message;
    }
  }

  return results;
};
