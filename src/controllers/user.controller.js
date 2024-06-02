var { User } = require('../models/user.model')


module.exports = {
    async login(req, res) {
        try {
            const data = req.body
            await User.login(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async add_user(req, res) {
        try {
            const data = req.body
            await User.add_user(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async update_info_user(req, res) {
        try {
            const data = req.body
            const params = req.params;
            await User.update_info_user(data, params, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async update_state_user(req, res) {
        try {
            const data = req.body
            const params = req.params;
            await User.update_state_user(data, params, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    async update_password_user(req, res) {
        try {
            const data = req.body
            const params = req.params;
            await User.update_password_user(data, params, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async read_all(req, res) {
        try {
            await User.read_all(function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async delete_user(req, res) {
        try {
            const data = req.params;
            await User.delete_user(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to delete agent' });
        }
    },

    async update_info(req, res) {
        try {
            const data = req.body
            await User.update_info(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async update_password(req, res) {
        try {
            const data = req.body
            await User.update_password(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
}



