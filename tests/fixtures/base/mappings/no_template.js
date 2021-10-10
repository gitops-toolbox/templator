/**
 *
 * @param {*} context
 */
exports.render = function (context) {
  const locations = [];
  for (const component of Object.keys(context.components)) {
    locations.push({
      contextSelector: `components.${component}`,
      destination: {},
    });
  }

  return { locations: locations };
};
