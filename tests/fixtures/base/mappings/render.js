exports.render = (context, meta) => {
  return {
    locations: [
      {
        template: `templates/${context['1']}`,
        contextSelector: '1',
      },
    ],
  };
};
