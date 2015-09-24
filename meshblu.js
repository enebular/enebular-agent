'use strict';

var config = {
  mongo: {
    databaseUrl: process.env.MESHBLU_MONGODB_URI
  },
  port: parseInt(process.env.MESHBLU_HTTP_PORT) || 3001,
  uuid: process.env.UUID,
  token: process.env.TOKEN,
  mqtt: {
    databaseUrl: process.env.MQTT_DATABASE_URI,
    port: parseInt(process.env.MQTT_PORT),
    skynetPass: process.env.MQTT_PASSWORD
  }
};

module.exports = {
  start: function() {
    console.log('Starting HTTP/HTTPS...');
    var httpServer = require('meshblu-server/lib/httpServer')(config);
    console.log(' done.');

    console.log('Starting MQTT...');
    var mqttServer = require('meshblu-server/lib/mqttServer')(config);
    console.log(' done.');
  }
};
