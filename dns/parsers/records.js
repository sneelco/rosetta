var parseRecords = function(buffer, total, offset) {
  var i,
    size,
    qSize,
    parts = [],
    answers = [],
    len = buffer.length;

  for (i = 0; i < total; i += 1) {
    qSize = 0;
    while (offset < len) {
      size = buffer.slice(offset, offset + 1).readUInt8(0);
      if (size === 0 || size == 192) break ;
      part = buffer.slice(offset + 1, offset + size + 1).toString('utf-8');
      parts.push(part);
      offset += (parseInt(size, 10) + 1);
      qSize += (1 + size)
    }
    if (size == 192) {
      console.log('here');
      offset += 1;
    }
    answer_type = buffer.slice(offset + 1, offset + 3).readUInt16BE(0);
    answer_class = buffer.slice(offset + 3, offset + 5).readUInt16BE(0);
    answer_ttl = buffer.slice(offset + 5, offset + 9).readInt32BE(0);
    answer_length = buffer.slice(offset + 9, offset + 11).readUInt16BE(0);
    answer_data = buffer.slice(offset + 11,offset + 11 + answer_length);

    switch (answer_type) {
      case 1:
        answer_data = decToIP(answer_data.readUInt32BE(0));
        break;
    }

    answers.push({
      name: parts,
      type: answer_type,
      class: answer_class,
      ttl: answer_ttl,
      data_length: answer_length,
      data: answer_data,
      size: qSize + 14 + answer_length,
    });

    offset += 14 + answer_length;
  }
  return answers;
};

module.exports = parseRecords;
