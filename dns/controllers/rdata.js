var Types = require('./types'),
  toObject,
  toBuffer,
  TYPE_A = 1,
  TYPE_NS = 2,
  TYPE_MD = 3,
  TYPE_MF = 4,
  TYPE_CNAME = 5,
  TYPE_SOA = 6,
  TYPE_MB = 7,
  TYPE_MG = 8,
  TYPE_MR = 9,
  TYPE_NULL = 10,
  TYPE_WKS = 11,
  TYPE_PTR = 12,
  TYPE_HINFO = 13,
  TYPE_MINFO = 14,
  TYPE_MX = 15,
  TYPE_TXT = 16,
  TYPE_SRV = 28,
  TYPE_SRV = 33;


toObject = function (rdata, rdtype) {
  var obj;

  switch (rdtype) {
    case (rdtype === TYPE_A):
      obj = decToIP(rddata.readUInt32BE(0));
      break;
  }

  return obj
}

toBuffer = function (rdata, rdtype) {
  //Parse the record data and size
  switch (rdtype) {
    case 1:
      data_buf = Types.A_toBuffer(rdata);
      break;
    case 2: //NS
      data_buf = Types.NAME_toBuffer(rdata);
      break;
    case 5: //CNAME
      data_buf = Types.NAME_toBuffer(rdata);
      break;
    case 6: //SOA
      var primary_buf = Types.NAME_toBuffer(rdata.primary);
      var admin_buf = Types.NAME_toBuffer(rdata.admin);
      data_buf = new Buffer(20 + primary_buf.length + admin_buf.length);
      primary_buf.copy(data_buf, 0);
      admin_buf.copy(data_buf, primary_buf.length);
      data_buf.writeUInt32BE(rdata.serial, primary_buf.length + admin_buf.length);
      data_buf.writeUInt32BE(rdata.refresh, 4 + primary_buf.length + admin_buf.length);
      data_buf.writeUInt32BE(rdata.retry, 8 + primary_buf.length + admin_buf.length);
      data_buf.writeUInt32BE(rdata.expiration, 12 + primary_buf.length + admin_buf.length);
      data_buf.writeUInt32BE(rdata.minimum, 16 + primary_buf.length + admin_buf.length);
      break;
    case 12: //PTR
      data_buf = Types.NAME_toBuffer(rdata);
      break;
    case 15: //MX
      var name_buf = Types.NAME_toBuffer(rdata.name);
      data_buf = new Buffer(2 + name_buf.length);
      data_buf.writeUInt16BE(rdata.preference, 0);
      name_buf.copy(data_buf, 2);
      break;
    case 16: //TXT
      data_buf = new Buffer(rdata.length + 1);
      data_buf.writeUInt8(rdata.length, 0);
      data_buf.write(rdata, 1);
      break
    //case 28: //AAAA
    case 33: //SRV
      var name_buf = Types.NAME_toBuffer(rdata.target);
      data_buf = new Buffer(6 + name_buf.length);
      data_buf.writeUInt16BE(rdata.priority, 0);
      data_buf.writeUInt16BE(rdata.weight, 2);
      data_buf.writeUInt16BE(rdata.port, 4);
      name_buf.copy(data_buf, 6);
      break;
    //case 99: //SPF
    default:
      data_buf = new Buffer(0);
  }

  return data_buf;
}

module.exports = {
  toObject: toObject,
  toBuffer: toBuffer
}
