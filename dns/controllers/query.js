var Types = require('./types'),
  Classes = require('./classes'),
  queryProcess;

var queryResolve = function(q_name, q_type, q_class, flag) {
  var i,
    answers = [];

  for (i = 0; i < q_name.length; i += 1) {
    zone_lookup = q_name.slice(i, q_name.length).join('.');
    host_lookup = (q_type == Types.toInt('SOA') && flag) ? '' : q_name.slice(0, i).join('.');

    if (zones[zone_lookup]) {
      answers = zones[zone_lookup].records.filter(function (record) {
        if ((record.name === host_lookup && record.type === q_type && record.class === q_class)) {
          record.question = (flag || host_lookup == '') ? zone_lookup : host_lookup + '.' + zone_lookup;
          return true;
        } else {
          return false;
        }
      });
    }

    if (answers.length > 0) {
      break;
    }
  }

  return answers;
};

var queryProcess = function (request, response, client) {
  var records = [],
    auth_records = [],
    add_records = [];

  response.log = [];

  if (request.header.total_questions > 0) {
    request.questions.forEach(function(question) {

      if (question.type !== Types.toInt('AXFR')) {
        records = queryResolve(question.parts, question.type, question.class);

        if (question.type != Types.toInt('NS') && (records.length > 0)) {
          auth_records = queryResolve(question.parts, Types.toInt('NS'), question.class);
        }

        auth_records.forEach(function (auth_record) {
          add_records = queryResolve(auth_record.data.replace(/\.$/, '').split('.'), Types.toInt('A'), question.class);
        })
      } else {

      }

      if (records.length > 0) {
        //Process answer records
        response.header.rcode = 0;
        response.header.total_answers_rr = records.length;
        response.answers_rr = [];

        records.forEach(function (record) {
          var name = (record.name === '') ? record.zone : host_lookup + '.' + record.zone;
          response.answers_rr.push({
            parts: record.question.split('.'),
            type: record.type,
            class: record.class,
            ttl: record.ttl,
            data: record.data
          })
        });

        //Process authority records
        response.header.total_authority_rr = auth_records.length;
        response.authority_rr = [];

        auth_records.forEach(function (record) {
          var name = record.zone;
          response.authority_rr.push({
            parts: record.question.split('.'),
            type: record.type,
            class: record.class,
            ttl: record.ttl,
            data: record.data
          })
        });

        //Process additional records
        response.header.total_additional_rr = add_records.length;
        response.additional_rr = [];
        add_records.forEach(function (record) {
          var name = record.zone;
          response.additional_rr.push({
            parts: record.question.split('.'),
            type: record.type,
            class: record.class,
            ttl: record.ttl,
            data: record.data
          })
        });

        answer = 'NOERROR'
      } else {
        answer = 'NXDOMAIN'

        if (question.type != Types.toInt('SOA')) {
          auth_records = queryResolve(question.parts, Types.toInt('SOA'), question.class, true);

          //Process authority records
          response.header.total_authority_rr = auth_records.length;
          response.authority_rr = [];

          auth_records.forEach(function (record) {
            var name = record.zone;
            response.authority_rr.push({
              parts: record.question.split('.'),
              type: record.type,
              class: record.class,
              ttl: record.ttl,
              data: record.data
            })
          });
          console.log(auth_records)
        }
      }

      var log_items = [
        Classes.toStr(question.class),
        Types.toStr(question.type),
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

module.exports = {
  process: queryProcess
};
