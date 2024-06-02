var Alert = require('../models/alert.model')

module.exports = {
    async info(req, res) {
        res.send("alerInfo")
    },

    async read_all(req, res) {
        try {
            const params = req.params;
            const data = req.body
            await Alert.read_all(params, data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async statis_time(req, res) {
        try {
            const params = req.params;
            const data = req.body
            await Alert.statis_time(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async statis_sid(req, res) {
        try {
            const params = req.params;
            const data = req.body
            await Alert.statis_sid(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
}
