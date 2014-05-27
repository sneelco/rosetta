var parsers = require('../parsers'),
  queryHandler = require('./query'),
  updateHandler = require('./update'),
  tools = require('../tools'),
  request_handler;

request_handler = function (data, client) {
  var request = parsers.request(data),
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

  switch (request.header.opcode) {
    case 0: //Query
      response = queryHandler(request, response, client);
      break;
    //case 4: //Notify
    case 5: //Update
      response = updateHandler(request, response, client);
      break;
    default:
      response.log = ['UNHANDLED'];
      console.log('Unhandled opcode');
      break;
  }

  response.log.forEach(function (log) {
    console.log('[%s] %s:%s %s', new Date(), client.address, client.port, log);
  });

  return tools.buffers.build(response);
};

module.exports = request_handler;
