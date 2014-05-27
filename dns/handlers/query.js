var tools = require('../tools');

var query_handler = function (request, response, client) {
  var records = [];

  response.log = [];

  if (request.header.total_questions > 0) {
    request.questions.forEach(function(question) {
      for (i = 0; i < question.parts.length; i += 1) {
        zone_lookup = question.parts.slice(i, question.parts.length).join('.');
        host_lookup = question.parts.slice(0, i).join('.');
        if (zones[zone_lookup]) {
          switch (question.type) {
            case 252: //Transfers
              records = zones[zone_lookup].records;
              break;
            default:
              records = zones[zone_lookup].records.filter(function (record) {
                return (record.name === host_lookup && record.type === question.type && record.class === question.class);
              })
              break;
          }

          if (records.length > 0) {
            break;
          }
        }
      }

      if (records.length > 0) {
        response.header.rcode = 0;
        response.header.total_answers_rr = records.length;
        response.answers_rr = [];

        records.forEach(function (record) {
          var name = (record.name === '') ? zone_lookup : host_lookup + '.' + zone_lookup;
          response.answers_rr.push({
            parts: name.split('.'),
            type: record.type,
            class: record.class,
            ttl: record.ttl,
            data: record.data
          })
        })

        answer = 'NOERROR'
      } else {
        answer = 'NXDOMAIN'
      }

      var log_items = [
        tools.intToClass(question.class),
        tools.intToType(question.type),
        question.parts.join('.'),
        answer,
        records.length
      ]
      response.log.push('QUERY ' + log_items.join(' '))
    });
  } else {
    response.header.rcode = 1;
    response.log = ['QUERY FORMATERR']
  }

  return response;
};

module.exports = query_handler;
