var Agent = require('../models/agent.model')


module.exports = {
    async read_all(req, res) {
        try {
            await Agent.read_all(function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async read_all_connect(req, res) {
        try {
            await Agent.read_all_connect(function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async add_agent(req, res) {
        try {
            const data = req.body;
            await Agent.add_agent(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            // console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to add agent' });
        }
    },

    async update_agent(req, res) {
        try {
            const data = req.body;
            const params = req.params;
            await Agent.update_agent(params, data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to update agent' });
        }
    },

    async update_agent_apikey(req, res) {
        try {
            const data = req.body;
            const params = req.params;
            await Agent.update_agent_apikey(params, data, function (data) {
                res.send({ result: data })
            })
            // res.send("update_agent_apikey")
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to update agent' });
        }
    },

    async delete_agent(req, res) {
        try {
            const data = req.params;
            await Agent.delete_agent(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to delete agent' });
        }
    },

    async get_status_agent(req, res) {
        try {
            data = req.body
            await Agent.get_status_agent(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    ///agent
    async test_api(req, res) {
        try {
            data = req.headers.apikey
            await Agent.test_api(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

}
