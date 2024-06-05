const jwt = require("jsonwebtoken");
const config = require("../config/config")

module.exports = {
    async auth(req, res, next) {
        var token
        try {
            token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, config.authentication.jwtSecret);
            // console.log("jwt true")
            next()
        } catch {
            // console.log("jwt wrong")
            return res.status(401).send("Access denied. No token provided");
        }


    },

    async adminAuth(req, res, next) {
        var token
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, config.authentication.jwtSecret);
            if (decoded.role === "admin") {
                // console.log("admin jwt true")
                next();
            } else {
                res.status(400).send("Invalid token.");
            }
        } catch {
            // console.log("admin jwt wrong")
            return res.status(401).send("Access denied. No token provided");
        }


    }
}