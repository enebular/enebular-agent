var fs = require('fs');
var path = require('path');
var settings = require('./settings');

var dataDir = path.join(settings.userDir, 'data');

fs.stat(dataDir, function(err) {
	if(err) {
		fs.mkdir(dataDir);
	}
});

module.exports = {
	set : function(key, value, cb) {
		var dataPath = path.join(dataDir, key);
		fs.writeFile(dataPath, value, {encoding:'utf8'}, cb);
	},
	get : function(key, cb) {
		var dataPath = path.join(dataDir, key);
		fs.readFile(dataPath, {encoding:'utf8'}, cb);
	}
}