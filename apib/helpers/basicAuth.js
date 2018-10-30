const auth = require('basic-auth');
const users = require("../.auth.json")

module.exports = function (request, response, next) {
  var user = auth(request);
  if (!user || !users[user.name] || users[user.name].password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"');
    return response.status(401).send();
  }
  return next();
};