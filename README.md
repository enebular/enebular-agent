# enebular-agent


## 1. 鍵の作成

### Private Keyの作成

    openssl genrsa -des3 -out private.pem 2048

### Public Keyの生成

    openssl rsa -in private.pem -outform PEM -pubout -out public.pem


### Private Keyをdecryptする


    mv private.pem private_en.pem
    openssl rsa -in private_en.pem -out private.pem


## 2. テストスタート

    AUDIENCE=http://localhost:5000 PUBLIC_KEY_PATH=keys/public.pem ISSUER=http://localhost:7000 node app.js


AUDIENCEがhttps://localhostで始まっていると、sslフォルダ以下の自己証明書を使用しHTTPSサーバを起動します。

    AUDIENCE=https://localhost:5000 PUBLIC_KEY_PATH=keys/public.pem ISSUER=http://localhost:7000 node app.js


 ## 3. ステージング

環境変数AUDIENCEについては、意味的にREDIRECT_URIになっているので、変更します。

    REDIRECT_URI=https://localhost:5000 PUBLIC_KEY_PATH=path/to/public.pem ISSUER=https://enebular-staging.herokuapp.com MONGO_URI=mongodb://agent:enebular@ds051893.mongolab.com:51893/agent node app.js
