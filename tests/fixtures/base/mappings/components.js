exports.render = function (context, meta) {
  const locations = [];
  for (const component of Object.keys(context.components)) {
    locations.push({
      template: `components/${component}.njk`,
      contextSelector: `components.${component}`,
      destination: {},
    });
  }

  return { locations: locations };
};
