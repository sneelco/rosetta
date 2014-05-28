var updateProcess

updateProcess = function(request, response, client) {
    response.header.rcode = 5;
    response.log = ['UDPATE REFUSED']

    return response;
};

module.exports = {
  process: updateProcess
};
