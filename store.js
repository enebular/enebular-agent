var fs = require('fs');
var path = require('path');
var mongodb = require('mongodb');
var settings = require('./settings');

function FileStore() {
	var dataDir = path.join(settings.userDir, 'data');
	return {
		init : function(cb) {
			fs.stat(dataDir, function(err) {
				if(err) {
					fs.mkdir(dataDir);
				}
				cb(null);
			});
		},
		set : function(key, value, cb) {
			var dataPath = path.join(dataDir, key);
			fs.writeFile(dataPath, value, {encoding:'utf8'}, cb);
		},
		get : function(key, cb) {
			var dataPath = path.join(dataDir, key);
			fs.readFile(dataPath, {encoding:'utf8'}, cb);
		}
	}
}

function MongoStore(url) {
	var db = null;
	return {
		init : function(cb) {
            mongodb.MongoClient.connect(url,
                {
                    db:{
                        retryMiliSeconds:1000,
                        numberOfRetries:3
                    },
                    server:{
                        poolSize:1,
                        auto_reconnect:true,
                        socketOptions:{
                            socketTimeoutMS:10000,
                            keepAlive:1
                        }
                    }
                },
                function(err, _db) {
                    if (err) {
                    	cb(err);
                    	return;
                    }
                    db = _db;
                    cb(null);
                }
            );
		},
		set : function(key, val, cb) {
			db.collection('enebular.kvs').update({_id : key}, {$set:{value:val}}, {upsert:true},cb);
		},
		get : function(key, cb) {
			db.collection('enebular.kvs').findOne({_id : key}, function(err, doc) {
				if(err) return cb(err);
				if(!doc) return cb(null);
				cb(null, doc.value);
			});
		}
	}
}

if (settings.mongoUrl) {
	module.exports = MongoStore(settings.mongoUrl);
}else{
	module.exports = FileStore();
}
