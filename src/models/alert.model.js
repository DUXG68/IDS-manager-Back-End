const config = require('../config/config.js');
const client = require('../common/connect_els.js')

const Alert = function (rule) {
    // this.rule_id = rule.rule_id
    // this.content_rule = rule.content_rule
    // this.hostname = rule.hostname
    // this.rule_state = rule.rule_state
};


Alert.read_all = async function (params, data, result) {
    const escapeSpecialChars = (value) => {
        const specialChars = /[-+=><!(){}[\]\^\"~?:.\/\\]/g;
        return value.replace(specialChars, "\\$&");
    };
    var page = parseInt(params.page)
    const pageSize = 50;
    const from = (page - 1) * pageSize;
    const fields = ['rsyslog_hostname', 'local_time', 'srcport', 'sig_id', 'proto', 'dstport', 'ip_dst', 'sig_generator', 'sig_rev', 'msg', 'time_incident', 'ip_src'];

    try {
        const query = {
            bool: {
                must: []
            }
        };
        fields.forEach(field => {
            if (data[field]) {
                const escapedValue = escapeSpecialChars(data[field]);
                query.bool.must.push({
                    query_string: {
                        query: `*${escapedValue}*`,
                        default_field: `${field}`,
                        default_operator: `AND`
                    }
                });
            }
        });
        const esResponse = await client.search({
            index: `${config.elasticsearch.index}`,
            body: {
                query: query,
                sort: [
                    {
                        "@timestamp": {
                            order: "desc"
                        }
                    }
                ],
                from: from,
                size: pageSize
            }
        });
        const sources = esResponse.hits.hits.map(hit => hit._source);
        result({
            total: esResponse.hits.total.value,
            totalPages: Math.ceil(esResponse.hits.total.value / pageSize),
            hits: sources

        });

    } catch (error) {
        result("Error searching in Elasticsearch:");
    }
}

Alert.statis_time = async function (data, result) {

    const query = {
        size: 0,
        query: {
            range: {
                '@timestamp': {
                    gte: `now-${data.type}d/d`,
                    lte: 'now/d+7h' //asia/HoChiMinh+7     
                }
            }
        },
        aggs: {
            daily_count: {
                date_histogram: {
                    field: '@timestamp',
                    time_zone: '+07:00',      //asia/HoChiMinh+7  
                    calendar_interval: `${data.interval}`,
                    format: 'yyyy-MM-dd HH:mm:ss',
                    min_doc_count: 0
                }
            }
        }
    };

    async function runQuery() {
        try {
            const resPon = await client.search({
                index: `${config.elasticsearch.index}`,
                body: query
            });
            result(resPon.aggregations.daily_count.buckets);
        } catch (error) {
            result("Fail to connect Elasticsearch");
        }
    }
    runQuery()
}

Alert.statis_sid = async function (data, result) {
    const query = {
        size: 0,
        query: {
            range: {
                '@timestamp': {
                    gte: `now-${data.type}d/d`,
                    lte: 'now/d+7h'  //asia/HoChiMinh+7
                }
            }
        },
        aggs: {
            sig_id_count: {
                terms: {
                    field: 'sig_id',
                    size: 100
                }
            }
        }
    };
    async function runQuery() {
        try {
            const resPon = await client.search({
                index: `${config.elasticsearch.index}`,
                body: query
            });
            result(resPon.aggregations.sig_id_count.buckets);
        } catch (error) {
            result("Fail to connect Elasticsearch");
        }
    }
    runQuery()
}

module.exports = Alert;