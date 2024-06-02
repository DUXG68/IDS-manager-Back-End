const { Seeder } = require('./src/models/user.model')
var bodyParser = require('body-parser');
var cors = require('cors')
var config = require('./src/config/config')
var express = require('express');
var app = express();
const db = require('./src/common/connect')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
require('./src/routes/index')(app);

Seeder();

app.listen(config.PORT || 8888, function () {
    console.log(`Server listen ${config.PORT}`)
});