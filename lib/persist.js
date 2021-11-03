const _ = require('lodash');
const destinations = require('./destinations');
const [log, error] = require('./utils').getLogger(__filename);

async function _persist(dest_type, templates, args) {
  let results;
  try {
    const destination = new destinations[dest_type](templates, log, args);
    results = await destination.persist();
  } catch (e) {
    results = e.message;
  }

  return results;
}

async function _persistByGroup(dest_type, templates, args) {
  const results = {};
  const templates_by_group = _.groupBy(templates, 'group');
  for (const [group, template] of Object.entries(templates_by_group)) {
    results[group] = await _persist(dest_type, template, args);
  }

  return results;
}

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

    if (!_.isUndefined(args.groupBy)) {
      results[dest_type] = await _persistByGroup(dest_type, templates, args);
    } else {
      results[dest_type] = await _persist(dest_type, templates, args);
    }
  }

  return results;
};
