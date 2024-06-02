const elasticsearch = require('@elastic/elasticsearch');
const config = require('../config/config')

const client = new elasticsearch.Client({ node: `http://${config.elasticsearch.ip}:${config.elasticsearch.port}` })

module.exports = client;