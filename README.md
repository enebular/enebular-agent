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

    AUDIENCE=http://localhost:5000 PUBLIC_KEY_PATH=keys/public.pem ISSUER=http://localhost node app.js
