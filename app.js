var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var session = require('express-session');
var RED = require('node-red');
var settings = require('./settings');
var bodyParser = require('body-parser');
var app = express();


/*
pattern 1（自己証明書&localhost）
 REDIRECT_URI=https://localhost
pattern 2（自己証明書&localhost以外）
 REDIRECT_URI=https://{foo.com} TLS_KEY=./ssl/localhost.key TLS_CERT=./ssl/localhost.crt
pattern 3（heroku）
 REDIRECT_URI=https://{foo.com}
*/
var server = null;
if(process.env.REDIRECT_URI.match("^https://localhost")) {
  server = createHttpsServer(__dirname + '/ssl/localhost.key', __dirname + '/ssl/localhost.crt');
}else if(process.env.TLS_KEY && process.env.TLS_CERT) {
  server = createHttpsServer(process.env.TLS_KEY, process.env.TLS_CERT);
}else{
  server = createHttpServer();
}

function createHttpServer() {
  console.log("Create Normal HTTP Server");
  return http.createServer(app);
}

function createHttpsServer(key, cert) {
  console.log("Create Self Signed HTTPS Server");
  var options = {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert),
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

var store = require('./store');
var agentIdUtil = require('./server/agentid');
var searchModule = require('./server/search');

store.init(function(err) {
  if(err) throw err;
  agentIdUtil.init();
});

var JWTAuth = require('./auth/jwt');

if (process.env.PUBLIC_KEY_PATH) {
  app.all("/red/*", JWTAuth(process.env.PUBLIC_KEY_PATH, {
    issuer: process.env.ISSUER
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
app.use('/sys', express.static('top'));
app.set('view engine', 'ejs');


app.get('/red/search/:module', function(req, res) {
  var module = req.param('module');
  searchModule(module, function(err, content) {
    if(err) res.json({err:err});
    else res.json({content:content});
  });
});

app.post('/sys/user_id', function(req, res) {
  var user_id = req.param('user_id');
  store.get('user_id', function(err, old_user_id) {
    if(err) {
      res.json({err:err.message});
      return;
    }
    if(old_user_id) {
      res.json({err:"user_id was already registerd."});
      return;
    }
    store.set('user_id', user_id, function(err) {
      res.json({err:err});
    });
  });
});
app.get('/sys/agentid', function(req, res) {
  var user_id = req.param('user_id');
  //マッチしないと取得できない
  store.get('user_id', function(err, user_id2) {
    if(err) {
      res.json({err:err.message});
      return;
    }
    if(user_id != user_id2) {
      res.json({err:"user_id was not match."});
      return;
    }
    store.get('agentid', function(err, agentid) {
      if(err) {
        res.json({err:err.message});
        return;
      }
      res.json({err:null, content : {agentid : agentid} });
    });
  });
});
app.get('/sys/user_id', function(req, res) {
  store.get('user_id', function(err, user_id) {
    if(err) {
      res.json({err:err.message});
      return;
    }
    res.json({err:null, content : {user_id : user_id?true:false} });
  });
});
app.get('/sys/enebularurl', function(req, res) {res.json(process.env.ISSUER);});

RED.init(server, settings);
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);
var port = process.env.PORT || 5000;
server.listen(port);

RED.start();
