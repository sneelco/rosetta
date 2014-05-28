var Questions = require('./questions'),
  Records = require('./records'),
  responseToBuffer;

responseToBuffer = function(response) {
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
    questions = Questions.toBuffer(response.questions);

    tmpBuffer = new Buffer(buf.length + questions.length);
    buf.copy(tmpBuffer, 0);
    questions.copy(tmpBuffer, buf.length);
    buf = tmpBuffer;
  }

  if (response.answers_rr) {
    answers = Records.toBuffer(response.answers_rr);

    tmpBuffer = new Buffer(buf.length + answers.length);
    buf.copy(tmpBuffer, 0);
    answers.copy(tmpBuffer, buf.length);
    buf = tmpBuffer;
  }

  if (response.authority_rr) {
    authority_buf = Records.toBuffer(response.authority_rr);

    tmpBuffer = new Buffer(buf.length + authority_buf.length);
    buf.copy(tmpBuffer, 0);
    authority_buf.copy(tmpBuffer, buf.length);
    buf = tmpBuffer;
  }

  if (response.additional_rr) {
    additional_buf = Records.toBuffer(response.additional_rr);

    tmpBuffer = new Buffer(buf.length + additional_buf.length);
    buf.copy(tmpBuffer, 0);
    additional_buf.copy(tmpBuffer, buf.length);
    buf = tmpBuffer;
  }
  return buf;
};

module.exports = {
  toBuffer: responseToBuffer
}
