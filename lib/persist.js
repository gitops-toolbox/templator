const _ = require('lodash');
const destinations = require('./destinations');
const [log, error] = require('./utils').getLogger(__filename);

module.exports = async function (mappings, args) {
  const templates_by_destinations = _.groupBy(
    mappings.locations,
    'destination.type'
  );

  const results = {};

  for (const [destination, templates] of Object.entries(
    templates_by_destinations
  )) {
    if (_.isUndefined(destinations[destination])) {
      log('Destination %s not supported', destination);
      continue;
    }

    results[destination] = await new destinations[destination](
      templates,
      log,
      args
    ).persist();
  }

  return results;
};
