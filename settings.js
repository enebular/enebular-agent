var path = require('path');


var settings = {
  debugMaxLength: 10000000,
  autoInstallModules: true,
  httpAdminRoot: '/red',
  httpNodeRoot: '/',
  nodesPath: 'nodes',
  //nodesDir: '', <-enebular agentでは決めうちのはず
  functionGlobalContext: { },    // enables global context
  httpNodeCors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
  },
  verbose : true
};

if (process.env.MONGO_URI || process.env.MONGOLAB_URI) {
  settings.storageModule = require('./mongostorage');
  settings.mongoUrl = process.env.MONGO_URI || process.env.MONGOLAB_URI;
  settings.mongoAppname = 'enebular';
}

module.exports = settings;