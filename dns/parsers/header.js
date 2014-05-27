var parseHeaders = function (header) {
    var headers = {};

    var toDecimal = function (a) {
      return parseInt(a.join(''), 2);
    };

    headers.id = header.slice(0,2).readUInt16BE(0);

    rawBits1 = header.slice(2,3).toString('binary', 0, 1).charCodeAt(0);
    headers.qr = sliceBits(rawBits1, 0, 1);
    headers.opcode = sliceBits(rawBits1, 1, 4);
    headers.aa = sliceBits(rawBits1, 5, 1);
    headers.tc = sliceBits(rawBits1, 6, 1);
    headers.rd = sliceBits(rawBits1, 7, 1);

    rawBits2 = header.slice(3,4).toString('binary', 0, 1).charCodeAt(0);
    headers.ra = sliceBits(rawBits2, 0, 1);
    headers.z = sliceBits(rawBits2, 1, 1);
    headers.ad = sliceBits(rawBits2, 2, 1);
    headers.cd = sliceBits(rawBits2, 3, 1);
    headers.rcode = sliceBits(rawBits2, 4, 4);

    headers.total_questions = header.slice(4, 6).readUInt16BE(0);
    headers.total_answers_rr = header.slice(6, 8).readUInt16BE(0);
    headers.total_authority_rr = header.slice(8, 10).readUInt16BE(0);
    headers.total_additional_rr = header.slice(10, 12).readUInt16BE(0);

    return headers;
};

module.exports = parseHeaders;
