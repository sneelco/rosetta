buffers = require('./buffers');

typeToInt = function (t) {
  mapping = {
    A: 1,
    CNAME: 5
  }
  return mapping[i];
};

intToType = function (i) {
  mapping = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    15: 'MX',
    16: 'TXT',
    33: 'SRV',
    252: 'AXFR'

  }
  return mapping[i] || i;
};

classToInt = function (t) {
  mapping = {
    IN: 1
  }
  return mapping[i];
};

intToClass = function (i) {
  mapping = {
    1: 'IN'
  }
  return mapping[i];
};

decToIP = function (num) {
  var d = num % 256;
  for (var i = 3; i > 0; i--) {
    num = Math.floor(num/256);
    d = num % 256 + '.' + d;
  }
  return d;
};

ipToDec = function (dot) {
  var d = dot.split('.');
  return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
};

sliceBits = function(b, off, len) {
  var s = 7 - (off + len - 1);

  b = b >>> s;
  return b & ~(0xff << len);
};


module.exports = {
  buffers: buffers,
  sliceBits: sliceBits,
  ipToDec: ipToDec,
  decToIP: decToIP,
  intToClass: intToClass,
  classToInt: classToInt,
  intToType: intToType,
  typeToInt: typeToInt,
}
