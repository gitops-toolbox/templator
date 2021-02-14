const fs = require('fs');

function isDirectory(path) {
  return fs.statSync(path).isDirectory();
}

function pushToIf(element, list, filter) {
  if (filter(element)) {
    list.push(element);
  }
}

function contextSliceParser (slice) {

  try {
      return JSON.parse(slice);
  }
  catch (e) {
      return slice;
  }
};

module.exports = {
  isDirectory,
  pushToIf,
  contextSliceParser
};
