
exports.list = function(req, res,api){
    var tokenFound = false;
    for(var item in req.headers) {
        if (item == 'x-auth') {
            console.log('Token found ' + item + ": " + req.headers[item]);
            tokenFound = true;
        }
    }
    if (!tokenFound) {
        res.send({code : 0, message : 'Malformed token. Login please'})
    }
  res.send("respond with a resource");
};