/**
 *
 * @param {*} context
 */
exports.render = function (data) {
  const locations = [];
  for (const component of Object.keys(data.context.components)) {
    locations.push({
      contextSelector: `components.${component}`,
      destinations: [],
    });
  }

  return { locations: locations };
};
