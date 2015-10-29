var path = require('path');

var settings = {
  debugMaxLength: 10000000,
  autoInstallModules: true,
  httpAdminRoot: '/red',
  httpNodeRoot: '/',
  nodesDir: path.join(__dirname, 'nodes'),
  functionGlobalContext: { },    // enables global context
  httpNodeCors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
  },
  swagger: {
    template: {
      swagger: "2.0",
      info: {
        title: "My Node-RED API",
        version: "0.0.1"
      }
    }
  }
};

if (process.env.MONGO_URI || process.env.MONGOLAB_URI) {
  settings.storageModule = require('./mongostorage');
  settings.mongoUrl = process.env.MONGO_URI || process.env.MONGOLAB_URI;
  settings.mongoAppname = 'enebular';
} else {
  settings.userDir = path.join(__dirname);
}

module.exports = settings;
