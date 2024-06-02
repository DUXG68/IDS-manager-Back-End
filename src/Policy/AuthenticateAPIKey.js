require('dotenv').config()

module.exports = {
    async check_apikey(req, res, next) {
        try {
            data = req.headers.apikey
            if (data === process.env.APIKEY) {
                next();
            } else {
                res.status(500).send("wrong apikey");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
}