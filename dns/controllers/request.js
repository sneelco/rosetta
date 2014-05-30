var Query = require('./query'),
  Update = require('./update'),
  Header = require('./header'),
  Questions = require('./questions'),
  Records = require('./records'),
  Response = require('./response'),
  requestToObject,
  requestProcess;

requestProcess = function (data, client) {
  var request = requestToObject(data),
    response;

  //Our default response (an error)
  response =   {
    log: ['UNKNOWN'],
    header: {
      id: request.header.id,
      qr: 1,
      opcode: 0,
      aa: 1,
      tc: 0,
      rd: request.header.rd,
      ra: 1,
      z: 0,
      ad: 0,
      cd: 0,
      rcode: 3,
      total_questions: request.header.total_questions,
      total_answers_rr: 0,
      total_authority_rr: 0,
      total_additional_rr: 0
    },
    questions: request.questions
  }
  //crypto.createHmac('md5', 'mykey').update('test2').digest('base64')

  switch (request.header.opcode) {
    case 0: //Query
      response = Query.process(request, response, client);
      break;
    //case 4: //Notify
    case 5: //Update
      response = Update.process(request, response, client);
      break;
    default:
      response.log = ['UNHANDLED'];
      console.log('Unhandled opcode');
      break;
  }

  response.log.forEach(function (log) {
    console.log('[%s] %s:%s %s', new Date(), client.address, client.port, log);
  });

  response = Response.toBuffer(response);

  return response;
};

requestToObject = function(msg) {
  var request = {};

  request.header = Header.toObject(msg);
  offset = 12;

  if (request.header.total_questions > 0) {
    request.questions = Questions.toObject(msg, request.header.total_questions);
    request.questions.forEach(function (q) { offset += q.size; })
  }

  if (request.header.total_answers_rr > 0) {
    request.answers_rr = Records.toObject(msg, request.header.total_answers_rr, offset)
    request.answers_rr.forEach(function (q) { offset += q.size; })
  }

  if (request.header.total_authority_rr > 0) {
    request.authority_rr = Records.toObject(msg, request.header.total_authority_rr, offset)
    request.authority_rr.forEach(function (q) { offset += q.size; })
  }

  if (request.header.total_additional_rr > 0) {
    request.additional_rr = Records.toObject(msg, request.header.total_additional_rr, offset)
    request.additional_rr.forEach(function (q) { offset += q.size; })
  }

  return request;
};

module.exports = {
  process: requestProcess,
  toObject: requestToObject
}
