/**
 *
 * @param {*} context
 */
exports.render = function (context) {
  const locations = [];
  for (const [component, data] of Object.entries(context.components)) {
    locations.push({
      template: `components/${component}.njk`,
      contextSelector: `components.${component}`,
      destination: {},
    });
  }

  return { locations: locations };
};
