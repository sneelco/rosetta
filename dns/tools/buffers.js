var build,
  record,
  question,
  mkName;

build = function(response) {
  var buf = new Buffer(12);

  //Zero out the buffer
   for(var i=0;i<buf.length;i++) { buf[i]=0;}

  buf.writeUInt16BE(response.header.id, 0);
  buf[2] = 0x00 | response.header.qr << 7 | response.header.opcode << 3 | response.header.aa << 2 | response.header.tc << 1 | response.header.rd;
  buf[3] = 0x00 | response.header.ra << 7 | response.header.z << 4 | response.header.rcode;

  buf.writeUInt16BE(response.header.total_questions, 4)
  buf.writeUInt16BE(response.header.total_answers_rr, 6)
  buf.writeUInt16BE(response.header.total_authority_rr, 8)
  buf.writeUInt16BE(response.header.total_additional_rr, 10)

  if (response.questions) {
    questions = question(response.questions);

    tmpBuffer = new Buffer(buf.length + questions.length);
    buf.copy(tmpBuffer, 0);
    questions.copy(tmpBuffer, buf.length);
    buf = tmpBuffer;
  }

  if (response.answers_rr) {
    answers = record(response.answers_rr);

    tmpBuffer = new Buffer(buf.length + answers.length);
    buf.copy(tmpBuffer, 0);
    answers.copy(tmpBuffer, buf.length);
    buf = tmpBuffer;
  }

  if (response.authority_rr) {
    authority_buf = record(response.authority_rr);
  }

  if (response.additional_rr) {
    additional_buf = record(response.additional_rr);
  }
  return buf;
};

record = function(records) {
  var data_buf,
    total_size = 0;

  record_buffers = [];

  records.forEach(function (record) {
    var parts_size = 0,
      offset = 0;

    //Get the size of each part in addition to the one byte for the 8bit Int size
    record.parts.forEach(function (part) {
      parts_size += part.length + 1;
    });

    //Parse the record data and size
    switch (record.type) {
      case 1:
        //A records are 4 bytes for a 32bit UINT
        data_buf = new Buffer(4);
        data_buf.writeUInt32BE(ipToDec(record.data), 0)
        break;
      case 2: //NS
        data_buf = mkName(record.data);
        break;
      case 5: //CNAME
        data_buf = mkName(record.data);
        break;
      case 6: //SOA
        var primary_buf = mkName(record.data.primary);
        var admin_buf = mkName(record.data.admin);
        data_buf = new Buffer(20 + primary_buf.length + admin_buf.length);
        primary_buf.copy(data_buf, 0);
        admin_buf.copy(data_buf, primary_buf.length);
        data_buf.writeUInt32BE(record.data.serial, primary_buf.length + admin_buf.length);
        data_buf.writeUInt32BE(record.data.refresh, 4 + primary_buf.length + admin_buf.length);
        data_buf.writeUInt32BE(record.data.retry, 8 + primary_buf.length + admin_buf.length);
        data_buf.writeUInt32BE(record.data.expiration, 12 + primary_buf.length + admin_buf.length);
        data_buf.writeUInt32BE(record.data.minimum, 16 + primary_buf.length + admin_buf.length);
        break;
      case 12: //PTR
        data_buf = mkName(record.data);
        break;
      case 15: //MX
        var name_buf = mkName(record.data.name);
        data_buf = new Buffer(2 + name_buf.length);
        data_buf.writeUInt16BE(record.data.preference, 0);
        name_buf.copy(data_buf, 2);
        break;
      case 16: //TXT
        data_buf = new Buffer(record.data.length + 1);
        data_buf.writeUInt8(record.data.length, 0);
        data_buf.write(record.data, 1);
        break
      //case 28: //AAAA
      case 33: //SRV
        var name_buf = mkName(record.data.target);
        data_buf = new Buffer(6 + name_buf.length);
        data_buf.writeUInt16BE(record.data.priority, 0);
        data_buf.writeUInt16BE(record.data.weight, 2);
        data_buf.writeUInt16BE(record.data.port, 4);
        name_buf.copy(data_buf, 6);
        break;
      //case 99: //SPF
      default:
        data_buf = new Buffer(0);
    }

    //Build the record buffer
    record_buf = new Buffer(parts_size + 11 + data_buf.length);
    record_buf.fill(0);

    //Keep track of the total record buffer size
    total_size += record_buf.length;

    record.parts.forEach(function (part) {
      //Write the part size
      record_buf.writeUInt8(part.length, offset);
      //Write the part
      record_buf.write(part, offset + 1);
      //Adjust our offset
      offset += 1 + part.length;
    });

    //Add to the offset to adjust for the 0 byte after the parts
    offset += 1;

    //Write the record details
    record_buf.writeUInt16BE(record.type, offset)
    record_buf.writeUInt16BE(record.class, offset + 2)
    record_buf.writeUInt32BE(record.ttl, offset + 4)
    record_buf.writeUInt16BE(data_buf.length, offset + 8)

    //Write the record data depending on the type
    data_buf.copy(record_buf, offset + 10)

    record_buffers.push(record_buf);
  });

  record_buffer = new Buffer(total_size);
  record_buffer.fill(0);

  offset = 0;
  record_buffers.forEach(function (buf) {
    buf.copy(record_buffer, offset);
    offset += buf.length;
  })

  return record_buffer;
};

question = function(questions) {
  var total_size = 0;

  question_buffers = [];

  questions.forEach(function (question) {
    var parts_size = 0,
      offset = 0;

    question.parts.forEach(function (part) {
      parts_size += part.length + 1;
    });

    total_size += (parts_size + 5);
    question_buf = new Buffer(parts_size + 5);
    question_buf.fill(0);

    question.parts.forEach(function (part) {
      question_buf.writeUInt8(part.length, offset);
      question_buf.write(part, offset + 1);
      offset = offset + 1 + part.length;
    });

    question_buf.writeUInt16BE(question.type, offset + 1)
    question_buf.writeUInt16BE(question.class, offset + 3)

    question_buffers.push(question_buf);
  });

  question_buffer = new Buffer(total_size);
  question_buffer.fill(0);

  offset = 0;
  question_buffers.forEach(function (buf) {
    buf.copy(question_buffer, offset);
    offset += buf.length;
  })

  return question_buffer;
};

mkName = function (name) {
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
  build: build,
  record: record,
  question: question,
  mkName: mkName
}
