var update_handler = function(request, response, client) {
    response.header.rcode = 5;
    response.log = ['UDPATE REFUSED']

    return response;
};

module.exports = update_handler;
