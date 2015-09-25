var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var session = require('express-session');
var RED = require('node-red');
var settings = require('./settings');
var bodyParser = require('body-parser');
var app = express();

var server = null;
if(process.env.AUDIENCE.match("^https://localhost")) {
  server = createHttpsServer();
}else{
  server = createHttpServer();
}

function createHttpServer() {
  console.log("Create Normal HTTP Server");
  return http.createServer(app);
}

function createHttpsServer() {
  console.log("Create Self Signed HTTPS Server");
  var options = {
    key: fs.readFileSync(__dirname + '/ssl/localhost.key'),
    cert: fs.readFileSync(__dirname + '/ssl/localhost.crt'),
    ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
    honorCipherOrder: true,
    secureProtocol: 'TLSv1_2_method',
    requestCert: false,
    rejectUnauthorized: false
  };
  return https.createServer(options, app);
}

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({ secret: '4r13ysgyYD' }));

var agentIdUtil = require('./server/agentid');

agentIdUtil.init();

var JWTAuth = require('./auth/jwt');

if (process.env.PUBLIC_KEY_PATH) {
  app.all("/red/*", JWTAuth(process.env.PUBLIC_KEY_PATH, {
    issuer: process.env.ISSUER,
    audience: agentIdUtil.getAgentId()
  }));
} else if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
  settings.adminAuth = {
    type: 'credentials',
    users: [{
      username: process.env.NODE_RED_USERNAME,
      password: require('bcryptjs').hashSync(process.env.NODE_RED_PASSWORD, 8),
      permissions: '*',
    }]
  };
}

var store = require('./store');
app.use('/red', express.static('public'));
app.use('/', express.static('top'));
app.set('view engine', 'ejs');


app.post('/sys/user_id', function(req, res) {
  var user_id = req.param('user_id');
  store.set('user_id', user_id, function(err) {
    res.json({err:err});
  });
});
app.get('/sys/agentid', function(req, res) {
  res.json({agentid:agentIdUtil.getAgentId()});
});
app.get('/sys/user_id', function(req, res) {
  store.get('user_id', function(err, user_id) {
    res.json({user_id:user_id});
  });
});
app.get('/sys/enebularurl', function(req, res) {res.json(process.env.ISSUER);});

RED.init(server, settings);
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);
var port = process.env.PORT || 5000;
server.listen(port);

RED.start();
