var path = require('path');
var http = require('http');
var express = require('express');
var RED = require('node-red');
var settings = require('./settings');
var app = express();
app.use('/red', express.static('public'));
var server = http.createServer(app);

if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
  console.log(process.env.NODE_RED_USERNAME, process.env.NODE_RED_PASSWORD);
  settings.adminAuth = {
    type: "credentials",
    users: function(username) {
      console.log('users', username);
      if (process.env.NODE_RED_USERNAME == username) {
        return when.resolve({username:username,permissions:"*"});
      } else {
        return when.resolve(null);
      }
    },
    authenticate: function(username, password) {
      console.log('authenticate', username, password);
      if (process.env.NODE_RED_USERNAME == username &&
        process.env.NODE_RED_PASSWORD == password) {
        return when.resolve({username:username,permissions:"*"});
      } else {
        return when.resolve(null);
      }
    }
  }

  settings.adminAuth = {
    type: 'credentials',
    users: [{
      username: process.env.NODE_RED_USERNAME,
      password: require('bcryptjs').hashSync(process.env.NODE_RED_PASSWORD, 8),
      permissions: '*'
    }]
  };
} else {
  settings.adminAuth = {
    type: 'credentials',
    users: [{
      username: 'admin',
      password: '$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.',
      permissions: '*'
    }]
  };
}

RED.init(server, settings);
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);
//server.listen(5000);
var port = process.env.PORT || 5000;
server.listen(port);

RED.start();
