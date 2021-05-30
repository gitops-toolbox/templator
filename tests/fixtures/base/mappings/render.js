exports.render = (data) => {
  return {
    locations: [
      {
        template: `templates/${data.context['1']}`,
        contextSelector: '1',
      },
    ],
  };
};
