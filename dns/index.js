var dgram = require('dgram'),
  net = require('net'),
  udp_server = dgram.createSocket("udp4");
  tcp_server = net.createServer(),
  handlers = require('./handlers'),
  parsers = require('./parsers'),
  zones = {};

module.exports = {
  start: function (config) {
    var port = config.port || '53',
      udp_port = config.udp_port || port,
      tcp_port = config.tcp_port || port;

    this.zones = config.zones || {};

    udp_server.on("listening", function () {
      var address = udp_server.address();
      console.log("UDP Server listening " + address.address + ":" + address.port);
    });

    udp_server.on('message', function (msg, client) {

      //Call the handler to get our response
      response = handlers.request(msg, {
        port: client.port,
        address: client.address
      });

      //Send the response
      udp_server.send(response, 0, response.length, client.port, client.address, function (err, sent) {});
    });

    udp_server.on("error", function (err) {
      console.log("server error:\n" + err.stack);
      udp_server.close();
    });

    tcp_server.on('connection', function(sock) {

        sock.on('data', function(data) {
          var response;

          //Call the handler to get our response
          response = handlers.request(data.slice(2,data.length), {
            port: sock.remotePort,
            address: sock.remoteAddress
          });

          //Send the response
          sock.write(response, function () {
            sock.end();
          });

        });
    });
    tcp_server.on('listening', function() {
      var address = tcp_server.address();
      console.log("TCP Server listening " + address.address + ":" + address.port);
    })
    udp_server.bind(udp_port);
    tcp_server.listen(tcp_port);


  },
  zones: {}
}
