exports.render = function (context) {
  context.newProperty = true;
  const locations = [
    {
      template: 'does not matter',
      contextSelector: 'does not matter',
    },
  ];

  return { locations };
};
