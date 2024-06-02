var Rule = require('../models/rule.model')


/////////////////////////////////////////////////thuộc agent
module.exports = {

    async get_rule_agent(req, res) {
        Rule.get_rule_agent(function (data) {
            res.send({ result: data })
        })
    },

    async save_rule_agent(req, res) {
        try {
            data = req.body;
            await Rule.save_rule_agent(data, function (result) {
                res.send({ result: result })
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    /////////////////////////////////////////////////////////////////thuộc manager

    async read_all(req, res) {
        try {
            data = req.params
            await Rule.read_all(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    async add_rule(req, res) {
        try {
            const data = req.body;
            await Rule.add_rule(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to add rules' });
        }
    },

    async add_rule_many_agent(req, res) {
        try {
            const data = req.body;
            await Rule.add_rule_many_agent(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to add rules' });
        }
    },

    async update_rule(req, res) {
        try {
            const data = req.body;
            await Rule.update_rule(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to add rules' });
        }
    },

    async update_rule_state(req, res) {
        try {
            const data = req.body;
            await Rule.update_rule_state(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to add rules' });
        }
    },

    async delete_rule(req, res) {
        try {
            const data = req.params;
            await Rule.delete_rule(data, function (data) {
                res.send({ result: data })
            })
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to add rules' });
        }
    },

    async write_rule_to_agent(req, res) {
        try {
            const data = req.body;
            await Rule.write_rule_to_agent(data, function (data) {
                // res.send(JSON.stringify({ result: data }))
                res.send({ result: data })
            })
            // res.send(req.body)
        } catch (error) {
            console.error('Error adding rules:', error);
            res.status(500).json({ error: 'Failed to add rules' });
        }
    },
}
