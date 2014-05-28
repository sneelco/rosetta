var typesToInt,
  typesToStr;

typesToInt = function (t) {
  mapping = {
    A: 1,
    NS: 2,
    CNAME: 5,
    SOA: 6
  }
  return mapping[t];
};

typesToStr = function (i) {
  mapping = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    6: 'SOA',
    15: 'MX',
    16: 'TXT',
    33: 'SRV',
    252: 'AXFR'

  }
  return mapping[i] || i;
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

types_A_toBuffer = function (rdata) {
  data_buf = new Buffer(4);
  data_buf.writeUInt32BE(ipToDec(rdata), 0)
  return data_buf;
}

types_NAME_ToBuffer = function (name) {
  var parts,
    offset,
    name_buffer;

  offset = 0;
  parts = name.split('.');
  name_buffer = new Buffer(parts + parts.length);
  name_buffer.fill(0);
  parts.forEach(function (part) {
    name_buffer.writeUInt8(part.length, offset);
    name_buffer.write(part, offset + 1);
    offset += 1 + part.length;
  })

  return name_buffer;
};

module.exports = {
  toInt: typesToInt,
  toStr: typesToStr,
  A_toBuffer: types_A_toBuffer,
  NAME_toBuffer: types_NAME_ToBuffer
};
