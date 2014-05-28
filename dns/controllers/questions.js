
var name = require('./name'),
  questionsToObject,
  questionsToBuffer;

questionsToObject = function(buffer, total) {
  var i,
    parts,
    record_type,
    offset = 12,
    record_class,
    questions = [];

  for (i = 0; i < total; i += 1) {
    //Parse the buffer for any name parts
    parts = name.toObject(buffer, offset);

    //Adjust our offset for the size of the parts
    offset += (parts.size + 1);

    //Get our TYPE and Class each are 16bit INTs
    record_type = buffer.readUInt16BE(offset);
    record_class = buffer.readUInt16BE(offset + 2);

    //Push the question to the questions array
    questions.push({
      parts: parts.parts,
      type: record_type,
      class: record_class,
      size: parts.size + 5,
    });

    //Adjust the offset for the type and class
    offset += 4
  }

  return questions;
};

questionsToBuffer = function(questions) {
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

module.exports = {
  toObject: questionsToObject,
  toBuffer: questionsToBuffer
}
