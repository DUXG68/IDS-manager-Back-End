const db = require('../common/connect.js')
const axios = require('axios');

const Rule = function (rule) {
    this.rule_id = rule.rule_id
    this.content_rule = rule.content_rule
    this.hostname = rule.hostname
    this.rule_state = rule.rule_state
};

var fs = require('fs');
const { type } = require('os');

/////////////////////////////////////////////////////////thuộc agents
const filePathRead = __dirname.replace('src\\models', '') + 'local.rules';
const filePathWrite = __dirname.replace('src\\models', '') + 'write.rules';

Rule.get_rule_agent = function (result) {
    read = []
    try {
        const fileData = fs.readFileSync(filePathRead, 'utf8');
        const lines = fileData.split('\n');
        const jsonData = []

        for (let i = 0; i < lines.length - 1; i++) {

            let ruleJson = {
                id: i,
                info: lines[i]
            }
            const dataObject = JSON.stringify(ruleJson);
            jsonData.push(dataObject);
        }
        result(jsonData)
    } catch (err) {
        console.error('Error reading file:', err);
    }

}

Rule.save_rule_agent = async function (data, result) {
    const infoArray = [];
    data.forEach(item => {
        const content_rule = item.content_rule;
        infoArray.push(content_rule);
    });

    const Contents = infoArray.join('\n') + "\n";
    await fs.writeFileSync(filePathWrite, Contents, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data has been written to file successfully!');
        }
    });


    result({ data, status: "success" })
}


//////////////////////////////////////////////////////////////thuộc manager

Rule.read_all = async function (data, result) {
    if (!data.agent_id.trim()) {
        result("Input invalid");
        return;
    }
    await db.query("SELECT Rule.*, Agent.hostname, Agent.host_ip FROM Rule INNER JOIN Agent ON Rule.agent_id = Agent.agent_id WHERE Rule.agent_id = ?;", [data.agent_id], function (err, rule) {
        if (err) {
            result(err)
        } else {
            result(rule)
        }
    })
}
//
Rule.add_rule = async function (data, result) {
    try {
        if (!data.content_rule.trim() || !data.rule_state.trim() || !data.description.trim()) {
            result("Input is not valid or not full");
            return;
        }
        if (data.rule_state !== 'enable' && data.rule_state !== 'disable') {
            result("Rule state must be 'enable' or 'disable'");
            return;
        }

        await db.query("INSERT INTO Rule (content_rule, agent_id , rule_state, description) VALUES (?,?,?,?)", [data.content_rule, data.agent_id, data.rule_state, data.description], function (err, rule) {
            if (err) {
                result(err)
            } else {
                result({ rule_id: rule.insertId })
            }
        });
    } catch (error) {
        result('Failed to add rules in model');
    }
}

Rule.add_rule_many_agent = async function (data, result) {
    try {
        if (!data.content_rule.trim() || !data.rule_state.trim()) {
            result("Input is not valid or not full");
            return;
        }
        if (data.rule_state !== 'enable' && data.rule_state !== 'disable') {
            result("Rule state must be 'enable' or 'disable'");
            return;
        }

        data.agent_ids.forEach(async (item_agent_id) => {
            if (item_agent_id != data.agent_id) {
                await db.query("INSERT INTO Rule (content_rule, agent_id , rule_state, description) VALUES (?,?,?,?)", [data.content_rule, item_agent_id, data.rule_state, data.description], function (err, rule) {
                    if (err) {
                        console.log("error model rule add_rule_many_agent")
                    }
                });
            }
        });
        if (data.agent_ids.includes(data.agent_id.toString())) {
            await db.query("INSERT INTO Rule (content_rule, agent_id , rule_state, description) VALUES (?,?,?,?)", [data.content_rule, data.agent_id, data.rule_state, data.description], function (err, rule) {
                if (err) {
                    result(err)
                } else {
                    result({ rule_id: rule.insertId })
                }
            });
        } else {
            result("Success!");
        }

    } catch (error) {
        result('Failed to add rules in model');
    }
}

Rule.update_rule = async function (data, result) {
    try {
        // if (!data.content_rule.trim() || !data.agent_id.trim() || !data.rule_state.trim() || !data.rule_id.trim()) {
        if (!data.content_rule.trim() || !data.rule_state.trim() || !data.description.trim()) {
            result("Input is not valid or not full");
            return;
        }
        if (data.rule_state !== 'enable' && data.rule_state !== 'disable') {
            result("Rule state must be 'enable' or 'disable'");
            return;
        }
        await db.query("UPDATE Rule SET content_rule = ?, rule_state = ?, agent_id = ?, description= ? WHERE rule_id = ?", [data.content_rule, data.rule_state, data.agent_id, data.description, data.rule_id], function (err, rule) {
            if (err) {
                result(err)
            } else {
                result("update success")
            }
        });
    } catch (error) {
        console.error('Error adding rules:', error);
        result("Error adding rule")
    }
}
//
Rule.update_rule_state = async function (data, result) {
    try {
        if (!data.rule_state.trim()) {
            // if (!data.rule_state.trim() || !data.rule_id.trim()) {
            result("Input is not valid or not full");
            return;
        }
        if (data.rule_state !== 'enable' && data.rule_state !== 'disable') {
            result("Rule state must be 'enable' or 'disable'");
            return;
        }
        const query = `UPDATE Rule SET rule_state = ? WHERE rule_id = ?;`;

        await db.query(query, [data.rule_state, data.rule_id], function (err, rule) {
            if (err) {
                result(err)
            } else {
                result("update state success")
            }
        });
        // result(query)
    } catch (error) {
        console.error('Error adding rules:', error);
        result({ error: 'Failed to add rules' });
    }
}

Rule.delete_rule = async function (data, result) {
    try {
        const query = `DELETE FROM Rule WHERE rule_id = ?;`;
        await db.query(query, [data.rule_id], function (err, rule) {
            if (err) {
                result(err)
            } else {
                result("delete rule success")
            }
        });
    } catch (error) {
        console.error('Error adding rules:', error);
        result({ error: 'Failed to add rules' });
    }
}

Rule.write_rule_to_agent = async function (body, result) {
    try {
        await db.query("SELECT Rule.content_rule FROM Rule JOIN Agent  ON Rule.agent_id = Agent.agent_id WHERE Rule.rule_state='enable' AND Agent.host_ip = ? AND Agent.agent_id = ?;", [body.host_ip, body.agent_id], function (err, rule) {
            if (err) {
                result(err)
            } else {
                const headers = { apikey: body.apikey };
                const url = `http://${body.host_ip}:8889/agent/rule/write`;
                const data = rule
                async function fetchData() {
                    try {
                        const response = await axios.post(url, data, { headers, timeout: 1000 });
                        result("success");
                    } catch (error) {
                        result('error call api agent');
                    }
                }
                fetchData();
            }
        });

    } catch (error) {
        result({ error: 'Failed to add rules' });
    }
}


module.exports = Rule;

