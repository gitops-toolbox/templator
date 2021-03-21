exports.render = function (context) {
  const locations = [];

  for (const component of context.components) {
    locations.push({
      template: '<path_component_to_template>',
      contextSelector: `components.${component}`,
      destination: {},
    });
  }

  return { locations: locations };
};
