/*global module */
module.exports = function (app) {
  'use strict';

  app.get('/', function (req, res) {
    res.render('index');
  });
  app.get('/rest/v1/:model', app.controllers.rest.get_model);
  app.post('/rest/v1/:model', app.controllers.rest.requireJson, app.controllers.rest.add_record);
  app.get('/rest/v1/:model/:id', app.controllers.rest.get_record);
  app.put('/rest/v1/:model/:id', app.controllers.rest.requireJson, app.controllers.rest.update_record);
  app.delete('/rest/v1/:model/:id', app.controllers.rest.delete_record);
};
