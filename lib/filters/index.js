const _ = require('lodash');

module.exports = {
  padEnd: _.padEnd,
  pad: _.pad,
  maxKeyLength: function (obj) {
    return _.max(Object.keys(obj).map((x) => x.length));
  },
};
