/**
 *
 * @param {*} context
 */
exports.render = function (context) {
  const locations = [];
  for (const component of Object.keys(context.components)) {
    locations.push({
      template: `components/${component}.njk`,
      destination: {},
    });
  }

  return { locations: locations };
};
