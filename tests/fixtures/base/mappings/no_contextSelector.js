/**
 *
 * @param {*} context
 */
exports.render = function (data) {
  const locations = [];
  for (const component of Object.keys(data.context.components)) {
    locations.push({
      template: `components/${component}.njk`,
      destinations: [],
    });
  }

  return { locations: locations };
};
