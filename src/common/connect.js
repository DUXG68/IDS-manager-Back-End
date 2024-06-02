var mysql = require("mysql")
const config = require('../config/config')
var connection = mysql.createConnection({
    host: config.HOST_DB,
    user: config.USER_DB,
    password: config.PASSWORD_DB,
    database: config.DATABASE
})
connection.connect(function (err) {
    if (err) {
        console.log("Ket noi den mysql khong thanh cong")
    }
})



module.exports = connection;