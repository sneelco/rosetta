var parseHeader = require('./header'),
  parseQuestions = require('./questions'),
  parseRecords = require('./records');

parseRequest = function(msg) {
  var request = {};

  request.header = parseHeader(msg);
  offset = 12;

  if (request.header.total_questions > 0) {
    request.questions = parseQuestions(msg, request.header.total_questions);
    request.questions.forEach(function (q) { offset += q.size; })
  }

  if (request.header.total_answers_rr > 0) {
    request.answers_rr = parseRecords(msg, request.header.total_answers_rr, offset)
    request.answers_rr.forEach(function (q) { offset += q.size; })
  }

  if (request.header.total_authority_rr > 0) {
    request.authority_rr = parseRecords(msg, request.header.total_authority_rr, offset)
    request.authority_rr.forEach(function (q) { offset += q.size; })
  }

  if (request.header.total_additional_rr > 0) {
    request.additional_rr = parseRecords(msg, request.header.total_additional_rr, offset)
    request.additional_rr.forEach(function (q) { offset += q.size; })
  }

  return request;
};

module.exports = parseRequest;
