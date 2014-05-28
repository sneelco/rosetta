
var rdata = require('../controllers/rdata'),
  name = require('../controllers/name'),
  recordsToObject,
  recordsToBuffer;

recordsToObject = function(buffer, total, offset) {
  var i,
    size,
    qSize,
    parts = [],
    answers = [],
    len = buffer.length;

  for (i = 0; i < total; i += 1) {
    //Parse the buffer for any name parts
    parts = name.toObject(buffer, offset);

    //Adjust our offset for the size of the parts
    offset += (parts.size + 1);

    //Parse out the various record details
    answer_type = buffer.readUInt16BE(offset);
    answer_class = buffer.readUInt16BE(offset + 2);
    answer_ttl = buffer.readInt32BE(offset + 4);
    answer_length = buffer.readUInt16BE(offset + 8);
    answer_data = buffer.slice(offset + 10,offset + 10 + answer_length);

    //Parse the rdata to an object
    answer_data = rdata.toObject(answer_data, answer_type);

    //Push the record to answers array
    answers.push({
      name: parts,
      type: answer_type,
      class: answer_class,
      ttl: answer_ttl,
      data_length: answer_length,
      data: answer_data,
      size: parts.size + 14 + answer_length,
    });

    //Adjust the offset for the various record details (14 bytes + rdata size)
    offset += (14 + answer_length);
  }

  return answers;
};

recordsToBuffer = function(records) {
  var data_buf,
    total_size = 0;

  record_buffers = [];

  records.forEach(function (record) {

    var offset = 0;

    //Build the name buffer
    name_buf = name.toBuffer(record.parts);

    //Build the rdata buffer
    rdata_buf = rdata.toBuffer(record.data, record.type);

    //Build the record buffer
    record_buf = new Buffer(name_buf.length + 11 + rdata_buf.length);
    record_buf.fill(0);

    //Copy the name into the record buffer
    name_buf.copy(record_buf, offset);

    //Adjust the offset
    offset += name_buf.length + 1;

    //Write the record details
    record_buf.writeUInt16BE(record.type, offset)
    record_buf.writeUInt16BE(record.class, offset + 2)
    record_buf.writeUInt32BE(record.ttl, offset + 4)
    record_buf.writeUInt16BE(rdata_buf.length, offset + 8)

    //Write the RDATA
    rdata_buf.copy(record_buf, offset + 10);

    //Copy the record buffer into the buffers array
    record_buffers.push(record_buf);

    //Keep track of the total record buffer size
    total_size += record_buf.length;
  });

  record_buffer = new Buffer(total_size);

  offset = 0;
  record_buffers.forEach(function (buf) {
    buf.copy(record_buffer, offset);
    offset += buf.length;
  })

  return record_buffer;
};

module.exports = {
  toObject: recordsToObject,
  toBuffer: recordsToBuffer
};
