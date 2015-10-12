# enebular agent

The enebular agent is used to Data Management.

For more about enebular see [enebular.com](https://enebular.com).

## Use file storage

	REDIRECT_URI=https://<Deployed host and port number> PUBLIC_KEY_PATH=/key/path/public.pem ISSUER=https://enebular.com node app.js

## Use mongodb storage

	REDIRECT_URI=https://<Deployed host and port number> PUBLIC_KEY_PATH=/key/path/public.pem ISSUER=https://enebular.com MONGO_URI=<MongoDB connection URI> node app.js
