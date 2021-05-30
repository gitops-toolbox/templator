exports.render = function (data) {
  const locations = [];

  for (const [key, value] of Object.entries(data.context.components)) {
    locations.push({
      template: '<path_component_to_template>',
      contextSelector: `components.${key}`,
      destinations: [],
    });
  }

  return { locations };
};
