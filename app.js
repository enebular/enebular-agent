var fs = require('fs');
var path = require('path');
var http = require('http');
var express = require('express');
var session = require('express-session');
var RED = require('node-red');
var settings = require('./settings');
var app = express();
var server = http.createServer(app);

app.use(session({ secret: '4r13ysgyYD' }));

var JWTAuth = require('./auth/jwt');

if (process.env.PUBLIC_KEY_PATH) {
  app.use(JWTAuth(process.env.PUBLIC_KEY_PATH, {
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
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

app.use('/red', express.static('public'));

app.get('/sys/enebularurl', function(req, res) {res.json(process.env.ISSUER);});

RED.init(server, settings);
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);
var port = process.env.PORT || 5000;
server.listen(port);

RED.start();
