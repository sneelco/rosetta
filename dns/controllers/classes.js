var classesToInt,
  classesToStr;

classesToInt = function (t) {
  mapping = {
    IN: 1
  }
  return mapping[i];
};

classesToStr = function (i) {
  mapping = {
    1: 'IN'
  }
  return mapping[i];
};

module.exports = {
  toInt: classesToInt,
  toStr: classesToStr
};
