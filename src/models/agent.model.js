const axios = require('axios');
const https = require('https');
const agentAxios = new https.Agent({
    rejectUnauthorized: false
});

const config = require('../config/config.js')
const db = require('../common/connect.js')

const ipRegex = /^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$/;
const Agent = function (agent) {
    this.agent_id = agent.agent_id
    this.host_ip = agent.host_ip
    this.hostname = agent.hostname
};

Agent.read_all = async function (result) {
    await db.query("SELECT * FROM Agent", function (err, agent) {
        if (err) {
            result(err)
        } else {
            result(agent)
        }
    })
}

Agent.read_all_connect = async function (result) {
    await db.query("SELECT * FROM Agent Where status='Connected'", function (err, agent) {
        if (err) {
            result(err)
        } else {
            result(agent)
        }
    })
}

Agent.add_agent = async function (data, result) {
    if (!data.hostname.trim() || !ipRegex.test(data.host_ip) || !data.apikey.trim()) {
        result("Input not valid or incorrect");
        return;
    }
    await db.query("INSERT INTO Agent (host_ip, hostname, apikey) VALUES (?, ?, ?)", [data.host_ip, data.hostname, data.apikey], function (err, agent) {
        if (err) {
            result("Duplicate entry")
        } else {
            result({ agent_id: agent.insertId })
        }
    })
}

Agent.update_agent = async function (params, data, result) {
    if (!data.hostname.trim() || !ipRegex.test(data.host_ip) || !data.apikey.trim()) {
        result("Input not valid or incorrect");
        return;
    }
    await db.query("UPDATE Agent SET host_ip = ?, hostname = ?, apikey=?, status=? WHERE agent_id = ?", [data.host_ip, data.hostname, data.apikey, data.status, params.agent_id], function (err, agent) {
        if (err) {
            result("Error")
        } else {
            if (agent.affectedRows === 0) {
                result("Agent not found");
            } else {
                result("Success");
            }
        }
    })
}

Agent.update_agent_apikey = async function (params, data, result) {
    if (!params.agent_id.trim() || !data.apikey.trim()) {
        result("Input not valid or incorrect");
        return;
    }
    await db.query("UPDATE Agent SET apikey = ? WHERE agent_id = ?", [data.apikey, params.agent_id], function (err, agent) {
        if (err) {
            result("Error")
        } else {
            if (agent.affectedRows === 0) {
                result("Agent not found");
            } else {
                result("Success");
            }
        }
    })
}

Agent.delete_agent = async function (data, result) {
    await db.query("DELETE FROM Agent WHERE agent_id = ?;", [data.agent_id], function (err, agent) {
        if (err) {
            result("Error")
        } else {
            if (agent.affectedRows === 0) {
                result("Agent not found");
            } else {
                result("Success");
            }
        }
    })
}

Agent.get_status_agent = async function (data, result) {
    const headers = { Apikey: data.apikey };
    const url = `https://${data.host_ip}:8889/agent/check_apikey`;
    try {
        const res = await axios.get(url, { headers, timeout: 1000, httpsAgent: agentAxios });
        result(res.data.result);

    } catch (error) {
        result('error');
        console.log('error')
    }
}

//agent api
Agent.test_api = async function (data, result) {
    result("success")
}

module.exports = Agent;