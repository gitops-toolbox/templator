exports.render = function (context, meta) {
  return `# Template file ${meta.__template}
# Mapping file ${meta.__mapping}

${JSON.stringify(context)}
`;
};
