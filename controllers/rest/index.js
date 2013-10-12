/*global module, require */

var models = require('../../models'),
    mongoose = require('mongoose'),
    RestInterface;

function restException(res, msg, code, fields) {
  'use strict';

  var body = {},
      field;

  res.header('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = code;
  body.error = msg;

  if (fields) {
    body.fields = {};
    for (field in fields) {
      body.fields[field] = fields[field].message;
    }
  }
  res.end(JSON.stringify(body));

}

module.exports = RestInterface = {
  parseSort: function (sort, model) {
    'use strict';

    var fields,
        total,
        valid = (model !== undefined && model.prototype && model.prototype instanceof mongoose.Model),
        found = false,
        sortObj = {},
        order,
        field,
        i;

    sort = sort || '';
    fields = sort.split('|');
    total = fields.length;

    if (!valid) {
      throw('Invalid model passed');
    }

    for (i = 0; i < total; i += 1) {
      field = fields[i];
      if (field[0] === '-') {
        order = -1;
        field = field.substring(1);
      } else {
        order = 1;
      }
      if (model.schema.paths[field]) {
        found = true;
        sortObj[field] = order;
      } else {
        throw new Error('Invalid sort field');
      }
    }

    return (found) ? sortObj : undefined;
  },
  parseRange: function (range, query) {
    'use strict';

    var options = {},
        start,
        end;

    query = query || {};
    range = range || '';
    range = range.match(/items (\d+)-(\d)/);

    if (query.offset || query.limit) {
      options.skip = parseInt(query.offset, 10) || 0;
      options.limit = parseInt(query.limit, 10) || 1;
    } else if (range) {
      start = parseInt(range[1], 10);
      end = parseInt(range[2], 10) + 1;
      options.limit = (end - start);
      options.skip = parseInt(start, 10);
    } else {
      options.limit = null;
      options.skip = 0;
    }

    return options;
  },
  parseFilter: function (filter, model) {
    'use strict';

    var filters = {},
        field,
        total,
        cond,
        opts,
        val,
        i;

    filter = filter || '';
    filter = filter.split('|');
    total = filter.length;

    for (i = 0; i < total; i += 1) {
      opts = filter[i].match(/(.+)([=~<>]+)(.+)/);
      if (opts) {
        field = opts[1];
        cond = opts[2];
        val = opts[3];
        if (model.schema.paths[field]) {
          switch (cond) {
          case '=':
            filters[field] = val;
            break;
          case '>':
            filters[field] = {$gt: val};
            break;
          case '>=':
            filters[field] = {$gte: val};
            break;
          case '<':
            filters[field] = {$lt: val};
            break;
          case '<=':
            filters[field] = {$lte: val};
            break;
          case '~':
            filters[field] = new RegExp(val, 'i');
            break;
          }
        }
      }
    }

    return (Object.keys(filters).length > 0) ? filters : null;
  },
  get_model: function (req, res) {
    'use strict';

    var self = RestInterface,
        end,
        data,
        range,
        total,
        sort,
        options = {},
        filter;

    if (models[req.params.model]) {
      data = models[req.params.model];
      sort = self.parseSort(req.query.sort, data);
      filter = self.parseFilter(req.query.filter, data);
      range = self.parseRange(req.headers.range, req.query);

      if (sort) { options.sort = sort; }

      data.find(filter, null, options, function (err, records) {
        total = records.length;
        if (total !== 0) {
          if (range.limit) {
            end = (range.skip + range.limit);
            end = (end > total) ? (total - 1) : (end - 1);
            if (range.skip > total - 1) {
              range.skip = 0;
              end = 0;
              total = 0;
            }
          } else {
            end = total - 1;
          }
        } else {
          range.skip = 0;
          end = 0;
          total = 0;
        }
        records = records.splice(range.skip, end + 1);
        res.header('Content-Range', 'items ' + range.skip + '-' + end + '/' + total);
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(records));
      });
    } else {
      restException(res, 'Model not found', 404);
    }
  },
  get_record: function (req, res) {
    'use strict';

    var model = models[req.params.model];

    if (model) {
      model.findOne({_id: req.params.id}, function (err, records) {
        if (err) {
          restException(res, 'Record not found', 404);
        } else {
          res.header('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(records));
        }
      });
    } else {
      restException(res, 'Model not found', 404);
    }
  },
  add_record: function (req, res) {
    'use strict';

    var model = models[req.params.model],
        record;

    if (model) {
      record = new models[req.params.model](req.body);
      record.save(function (err, record) {
        if (err) {
          restException(res, 'Error adding record', 400, err.errors);
        } else {
          res.header('Content-Type', 'application/json; charset=utf-8');
          res.statusCode = 201;
          res.end(JSON.stringify(record));
        }
      });
    } else {
      restException(res, 'Model not found', 404);
    }
  },
  update_record: function (req, res) {
    'use strict';

    var model = models[req.params.model];

    if (model) {
      delete req.body._id;
      model.update({_id: req.params.id}, req.body, function (err) {
        if (err) {
          restException(res, 'Error updating record', 400, err.errors);
        } else {
          res.header('Content-Type', 'application/json; charset=utf-8');
          res.send(204);
          res.end();
        }
      });
    } else {
      restException(res, 'Model not found', 404);
    }
  },
  delete_record: function (req, res) {
    'use strict';

    var model = models[req.params.model];

    if (model) {
      model.remove({_id: req.params.id}, function (err) {
        if (err) {
          restException(res, 'Record not found', 404);
        } else {
          res.header('Content-Type', 'application/json; charset=utf-8');
          res.send(204);
          res.end();
        }
      });
    } else {
      restException(res, 'Model not found', 404);
    }
  },
  requireJson: function (req, res, next) {
    'use strict';

    var acceptable = {'application/json': true},
        ctype = req.headers['content-type'];

    if (ctype) {
      ctype = ctype.split(';')[0];

      if (acceptable[ctype]) {
        next();
      } else {
        restException(res, 'Invalid Content-Type', 406);
      }
    } else {
      restException(res, 'Content-Type not specified', 406);
    }
  }
};