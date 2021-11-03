exports.render = function (context, meta) {
  const locations = [];

  for (const [environment, environment_data] of Object.entries(context)) {
    for (const [component, component_data] of Object.entries(
      environment_data.components
    )) {
      locations.push({
        template: `context.js`,
        contextSelector: `${environment}.components.${component}`,
        destination: {
          type: 'echo',
          params: {
            repo: environment_data.environment,
            filepath: `${component}.json`,
          },
        },
        tags: {
          env: environment_data.environment,
          component: component,
        },
      });
    }
  }

  return { locations };
};
