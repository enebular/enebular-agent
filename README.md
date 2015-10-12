# enebular agent
========================
The enebular agent is used to Data Management.For more about enebular see [enebular.com](https://enebular.com).

[![NPM](https://nodei.co/npm/enebular-agent.png?downloads=true)](https://nodei.co/npm/enebular-agent/)

Use file storage
-------

	REDIRECT_URI=https://<Deployed host and port number> PUBLIC_KEY_PATH=./keys/public.pem ISSUER=https://enebular.com node app.js

Use mongodb storage
-------

	REDIRECT_URI=https://<Deployed host and port number> PUBLIC_KEY_PATH=./keys/public.pem ISSUER=https://enebular.com MONGO_URI=<MongoDB connection URI> node app.js

Deploy to Heroku
-------

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/enebular/enebular-agent)

License
-------

See [license] (https://github.com/joeartsea/node-red-contrib-force/blob/master/LICENSE) (Apache License Version 2.0).
