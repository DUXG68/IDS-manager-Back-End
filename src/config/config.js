module.exports = {
    PORT: 8888,
    HOST_DB: '192.168.75.15',
    USER_DB: 'snort',
    PASSWORD_DB: 'Admin@123',
    DATABASE: 'snort',
    APIKEY: '123',
    AccAdmin: {
        user_name: "admin",
        password: "123456",
        role: "admin",
        user_state: "Active",
        count_try: 0,
        name: "Admin User"
    },
    threshold: 10,
    authentication: {
        jwtSecret: "secret",
    },
    elasticsearch: {
        ip: "192.168.75.15",
        port: "9200",
        index: "database_snort"
    }
}