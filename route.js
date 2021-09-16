const http = require('http');
const url = require('url');

function AccessControlConfig(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
}
function Prefligth(req, res) {
  if (req.method === 'OPTIONS') {
      console.log('preflight CORS verifications');
      res.end();
      // request handled
      return true;
  }
  // request not handled
  return false;
}

// Matière à discussion
// https://stackoverflow.com/questions/21001455/should-a-rest-api-be-case-sensitive-or-non-case-sensitive
// https://blog.restcase.com/5-basic-rest-api-design-guidelines/

module.exports = http.createServer((req, res) => {
  var mathOps = require('./controller.js');
  const reqUrl =  url.parse(req.url, true);
  // GET endpoint

  AccessControlConfig(res);
  if (!Prefligth(req, res)) {
    if(reqUrl.pathname == '/api/maths' && req.method === 'GET') {
      console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
      mathOps.getMaths(req, res);
    } else {
      console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
      mathOps.invalidUrl(req, res);
    }
  }
})