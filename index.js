const { Seeder } = require('./src/models/user.model')
var bodyParser = require('body-parser');
var cors = require('cors')
const fs = require('fs');
const path = require('path');
const https = require("https");
var config = require('./src/config/config')
var express = require('express');
var app = express();
const db = require('./src/common/connect')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
require('./src/routes/index')(app);

Seeder();
// const certPath = path.join(__dirname, 'src', 'certificate', 'localhost.pem');
// const keyPath = path.join(__dirname, 'src', 'certificate', 'localhost-key.pem');

// const certPath = "./src/certificate/localhost.crt";
// const keyPath = "./src/certificate/localhost-key.pem";
// Đọc các file certificate và key
// const options = {
//     key: fs.readFileSync(keyPath),
//     cert: fs.readFileSync(certPath)
// };



app.listen(config.PORT || 8888, function () {
    console.log(`Server listen ${config.PORT}`)
});
// const server = https.createServer(options, app);

// server.listen(config.PORT || 8888, () => {
//     console.log(`Server listen ${config.PORT}`);
// });