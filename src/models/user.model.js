const db = require('../common/connect.js')
const config = require('../config/config.js')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10)
const jwt = require("jsonwebtoken");

function jwtSignUp(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    const ONE_MIN = 15;
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK,
    });
}

const User = function (account) {
    this.account_id = account.account_id
    this.hostip = account.hostip
    this.hostname = account.hostname
};
const hashPassword = (pass) => { return bcrypt.hashSync(pass, salt) }

const Seeder = async function () {
    var passHash = hashPassword(config.AccAdmin.password)
    try {
        await db.query("SELECT user_id, user_name, role, user_state, name, count_try FROM User Where user_name = 'admin'", function (err, user) {
            if (err) {
                console.log("Ket noi den mysql khong thanh cong")
            } else if (user.length === 0) {
                async function addAdmin() {
                    await db.query("INSERT INTO User (user_name ,password ,role ,user_state ,count_try ,name) VALUES (?, ?, ?, ?, ?, ?)", [config.AccAdmin.user_name, passHash, config.AccAdmin.role, config.AccAdmin.user_state, config.AccAdmin.count_try, config.AccAdmin.name], function (err, user) {
                        if (err) {
                            console.log("Duplicate entry")
                        } else {
                            console.log("Admin account already exists")
                        }
                    })
                }
                addAdmin()
            } else {
                console.log("Admin ready")
            }
        })
    } catch (error) {
        console.log("Ket noi den mysql khong thanh cong")
    }
}
// const passRegex = /^[a-zA-Z0-9]{8,30}$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9]{5,}$/
const nameRegex = /^[a-zA-Z0-9\s]{5,}$/


User.add_user = async function (data, result) {
    if (!usernameRegex.test(data.user_name) || !passRegex.test(data.password) || (data.role !== "admin" && data.role !== "viewer") || (data.user_state !== "Active" && data.user_state !== "Block") || !nameRegex.test(data.name)) {
        result("Input not full or invalid");
        // result(!passRegex.test(data.password))
        return;
    }
    // || !(data.user_state !== "Active" && data.user_state !== "Block") 
    var passHash = hashPassword(data.password)
    await db.query("INSERT INTO User (user_name ,password ,role ,user_state ,count_try ,name) VALUES (?, ?, ?, ?, ?, ?)", [data.user_name, passHash, data.role, data.user_state, data.count_try, data.name], function (err, user) {
        if (err) {
            result("Duplicate entry")
        } else {
            result({ user_id: user.insertId })
        }
    })
}

User.update_info_user = async function (data, params, result) {
    if ((data.role !== "admin" && data.role !== "viewer") || !nameRegex.test(data.name) || !data.user_state.trim() || (data.user_state !== "Active" && data.user_state !== "Block")) {
        result("Input not full or invalid");
        return;
    }

    await db.query("UPDATE User SET role = ?, user_state = ?, name=?, count_try=? WHERE user_id = ?", [data.role, data.user_state, data.name, data.count_try, params.user_id], function (err, user) {
        if (err) {
            result("Error")
        } else {
            if (user.affectedRows === 0) {
                result("User not found");
            } else {
                result("Success");
            }
        }
    })
}

User.update_state_user = async function (data, params, result) {
    if (!data.user_state.trim() || (data.user_state !== "Active" && data.user_state !== "Block")) {
        result("Input not full or invalid");
        return;
    }

    await db.query("UPDATE User SET  user_state = ?,count_try = ? WHERE user_id = ?", [data.user_state, 0, params.user_id], function (err, user) {
        if (err) {
            result("Error")
        } else {
            if (user.affectedRows === 0) {
                result("User not found");
            } else {
                result("Success");
            }
        }
    })
}

User.update_password_user = async function (data, params, result) {
    if (!passRegex.test(data.password)) {
        result("Input not valid");
        return;
    }
    const passHash = hashPassword(data.password)
    await db.query("UPDATE User SET password=? WHERE user_id = ?", [passHash, params.user_id], function (err, user) {
        if (err) {
            result("Error")
        } else {
            if (user.affectedRows === 0) {
                result("User not found");
            } else {
                result("Success");
            }
        }
    })
}

User.read_all = async function (result) {
    await db.query("SELECT user_id, user_name, role, user_state, name, count_try FROM User", function (err, user) {
        if (err) {
            result(err)
        } else {
            result(user)
        }
    })
}

User.delete_user = async function (data, result) {
    await db.query("DELETE FROM User WHERE user_id = ?;", [data.user_id], function (err, user) {
        if (err) {
            result("Error")
        } else {
            if (user.affectedRows === 0) {
                result("User not found");
            } else {
                result("Success");
            }
        }
    })
}

User.update_info = async function (data, result) {
    if (!nameRegex.test(data.name) || typeof (data.user_id) !== "number") {
        result("Input not valid");
        return;
    }
    await db.query("UPDATE User SET name=? WHERE user_id = ?", [data.name, data.user_id], function (err, user) {
        if (err) {
            result("Error")
        } else {
            if (user.affectedRows === 0) {
                result("User not found");
            } else {
                result("Success");
            }
        }
    })
}

User.update_password = async function (data, result) {
    if (!passRegex.test(data.password_new) || typeof (data.user_id) !== "number") {
        result("New Password not valid or or input not valid");
        return;
    }
    const passNewHash = hashPassword(data.password_new)
    try {
        await db.query("SELECT password,count_try FROM User Where user_id=?", [data.user_id], function (err, user) {
            if (err) {
                result(err)
            } else {
                if (user.length === 0) {
                    result("User not found")
                } else if (user[0].count_try > config.threshold) {
                    async function blockUser() {
                        try {
                            await db.query("UPDATE User SET user_state='Block' WHERE user_id=?", [data.user_id], function (err, user) {
                                if (err) {
                                    result(err)
                                } else {
                                    result("Block user")
                                }
                            })
                        } catch (error) {
                            result("Can not block user");
                        }
                    }
                    blockUser();
                } else if (!bcrypt.compareSync(data.password, user[0].password)) {
                    async function upCountTry() {
                        try {
                            await db.query("UPDATE User SET count_try = count_try + 1 WHERE user_id=?", [data.user_id], function (err, user) {
                                if (err) {
                                    result(err)
                                } else {
                                    result("Password wrong")
                                }
                            })
                        } catch (error) {
                            result('Can not up count try');
                        }
                    }
                    upCountTry();
                } else {
                    async function updateStateUser() {
                        try {
                            await db.query("UPDATE User SET password=?,count_try = 0 WHERE user_id=?", [passNewHash, data.user_id, data.user_id], function (err, user) {
                                if (err) {
                                    result(err)
                                } else {
                                    result("update password success")
                                }
                            })
                        } catch (error) {
                            result('Can not update password');
                        }
                    }
                    updateStateUser();
                }
            }
        })
    } catch (error) {
        result({ error: 'Failed to call api update password' });
    }
}

User.login = async function (data, result) {
    if (!usernameRegex.test(data.user_name)) {
        result("Input not valid");
        return;
    }
    try {
        await db.query("SELECT password, user_state, count_try FROM User Where user_name=?", [data.user_name], function (err, user) {
            if (err) {
                result(err)
            } else {

                if (user.length === 0) {// không có user_name thỏa mãn hoặc đã bị block
                    result("Not find user")
                } else if (user[0].user_state === "Block") {
                    result("User is Blocked")
                } else if (!passRegex.test(data.password)) {
                    if (user[0].count_try > config.threshold) {
                        async function blockUser() {
                            try {
                                await db.query("UPDATE User SET user_state='Block' WHERE user_name=?", [data.user_name], function (err, user) {
                                    if (err) {
                                        result(err)
                                    } else {
                                        result("User is Blocked")
                                    }
                                })
                            } catch (error) {
                                result("Can not block user");
                            }
                        }
                        blockUser();
                    } else {
                        async function upCountTry() {
                            try {
                                await db.query("UPDATE User SET count_try = count_try + 1 WHERE user_name=?", [data.user_name], function (err, user) {
                                    if (err) {
                                        result(err)
                                    } else {
                                        result("Password wrong")
                                    }
                                })
                            } catch (error) {
                                result('Can not up count try');
                            }
                        }
                        upCountTry();
                    }
                } else if (!bcrypt.compareSync(data.password, user[0].password)) {// mật khẩu sai
                    if (user[0].count_try > config.threshold) {
                        async function blockUser() {
                            try {
                                await db.query("UPDATE User SET user_state='Block' WHERE user_name=?", [data.user_name], function (err, user) {
                                    if (err) {
                                        result(err)
                                    } else {
                                        result("User is Blocked")
                                    }
                                })
                            } catch (error) {
                                result("Can not block user");
                            }
                        }
                        blockUser();
                    } else {
                        async function upCountTry() {
                            try {
                                await db.query("UPDATE User SET count_try = count_try + 1 WHERE user_name=?", [data.user_name], function (err, user) {
                                    if (err) {
                                        result(err)
                                    } else {
                                        result("Password wrong")
                                    }
                                })
                            } catch (error) {
                                result('Can not up count try');
                            }
                        }
                        upCountTry();
                    }
                } else {
                    async function loginSuccess() {
                        try {
                            await db.query("UPDATE User SET count_try = 0 WHERE user_name=?", [data.user_name], function (err, user) {
                                if (err) {
                                    result(err)
                                } else {
                                    async function returnToken() {
                                        try {
                                            await db.query("SELECT user_id, role, name FROM User Where user_name = ?", [data.user_name], function (err, user) {
                                                if (err) {
                                                    result(err)
                                                } else {
                                                    result({ user_id: user[0].user_id, role: user[0].role, name: user[0].name, token: jwtSignUp({ user_id: user[0].user_id, role: user[0].role, name: user[0].name }) })
                                                }
                                            })

                                        } catch (error) {
                                            result('Can not get user data');
                                        }
                                    }
                                    returnToken();
                                }
                            })
                        } catch (error) {
                            result('Can not login');
                        }
                    }
                    loginSuccess();
                }
            }
        })
    } catch (error) {
        result({ error: 'Failed to call api login' });
    }
}

module.exports = {
    User: User,
    hashPassword: hashPassword,
    Seeder: Seeder
};