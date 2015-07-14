var path = require('path');

var settings = {
  debugMaxLength: 10000000,
  autoInstallModules: true,
  httpAdminRoot: '/red',
  httpNodeRoot: '/',
  nodesDir: path.join(__dirname, 'nodes'),
  storageModule: require('./mongostorage'),
  mongoAppname: 'enebular',
  mongoUrl: process.env.MONGOLAB_URI,
  functionGlobalContext: { },    // enables global context
  httpNodeCors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
  }
};

module.exports = settings;