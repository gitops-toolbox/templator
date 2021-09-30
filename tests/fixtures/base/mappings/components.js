/**
 *
 * @param {*} data
 */
exports.render = function (data) {
  const locations = [];
  for (const component of Object.keys(data.context.components)) {
    locations.push({
      template: `components/${component}.njk`,
      contextSelector: `components.${component}`,
      destination: {},
    });
  }

  return { locations: locations };
};
