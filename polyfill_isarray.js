// From https://stackoverflow.com/questions/1058427/how-to-detect-if-a-variable-is-an-array
Array.isArray = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};
