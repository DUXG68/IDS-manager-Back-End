const jwt = require("jsonwebtoken");
const config = require("../config/config")

module.exports = {
    async auth(req, res, next) {
        const token = req.headers.token;
        if (!token) return res.status(401).send("Access denied. No token provided");
        try {
            jwt.verify(token, config.authentication.jwtSecret);
            next()
        } catch (err) {
            res.status(400).send("Invalid token.");
        }
    },

    async adminAuth(req, res, next) {
        const token = req.headers.token;
        if (!token) return res.status(401).send("Access denied. No token provided");

        try {
            const decoded = jwt.verify(token, config.authentication.jwtSecret);
            if (decoded.role === "admin") {
                next();
            } else {
                res.status(400).send("Invalid token.");
            }
        } catch (err) {
            res.status(400).send("Invalid token.");
        }
    }
}