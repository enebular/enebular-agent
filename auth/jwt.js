var fs = require('fs');
var jwt = require('jsonwebtoken');

module.exports = function(publicKeyPath, options) {
  var publicKey = fs.readFileSync(publicKeyPath, 'utf8');
  return function authenticate(req, res, next) {
    if (!req.session) {
      throw new Error('Session is not available. Confirm the server setting.');
    } else if (req.session.identity) {
      next();
    } else {
      var token = req.query.auth_token;
      if (token) {
        console.log('token=', token);
        jwt.verify(token, publicKey, options, function(err, identity) {
          if (err) {
            return res.status(401).send(err.message);
          }
          console.log('Verified identity=', identity);
          req.session.identity = identity;
          res.redirect(req.path);
        });
      } else {
        res.status(401).send('Unauthorized');
      }
    }
  };
};
