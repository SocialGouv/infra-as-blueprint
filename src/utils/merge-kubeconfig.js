const { mergeWith } = require("lodash");

module.exports = (destination, source) => {
  return mergeWith(destination, source, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
};