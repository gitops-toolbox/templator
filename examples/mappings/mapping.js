exports.render = function (context) {
  const locations = [];

  for (const [component, data] of Object.entries(context.components)) {
    locations.push({
      template: '<path_component_to_template>',
      contextSelector: `components.${component}`,
      destination: {},
    });
  }

  return { locations };
};
