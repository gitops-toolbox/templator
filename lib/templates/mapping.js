// You can access the context with 'data.context'
// the output should be an object

exports.render = (data) => {
  return {
    locations: [
      {
        template: `${data.context.TEMPLATE}`,
        contextSelector: 'PATH.TO.CONTEXT',
        destination: {
          type: 'echo',
          params: {
            repo: 'ORG/REPO',
            filepath: 'PATH_ON_REPO',
          },
        },
        tags: {
          KEY1: 'VALUE1',
          KEY2: 'VALUE2',
        },
      },
    ],
  };
};
