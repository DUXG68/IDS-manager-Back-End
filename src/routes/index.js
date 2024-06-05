module.exports = (router) => {
    const ruleController = require('../controllers/rule.controller');
    const alertController = require('../controllers/alert.controller');
    const agentController = require('../controllers/agent.controller');
    const userController = require('../controllers/user.controller')
    const AuthenticateJWT = require('../Policy/AuthenticateJWT')
    // const AuthenticateAPIKey = require('../Policy/AuthenticateAPIKey');
    /// đối với api có áp dụng jwt phải gửi kèm user_id
    ///////////////////////////////////rule cua agent
    //rule
    // router.get("/agent/rule/read", ruleController.get_rule_agent)            //chưa dùng tới
    // router.post("/agent/rule/write", AuthenticateAPIKey.check_apikey, ruleController.save_rule_agent);        //
    // router.get("/agent/check_apikey", AuthenticateAPIKey.check_apikey, agentController.test_api);



    ///////////////////rule cua manager
    router.get("/rule/read_all/:agent_id", AuthenticateJWT.adminAuth, ruleController.read_all);              //
    router.delete("/rule/delete/:rule_id", AuthenticateJWT.adminAuth, ruleController.delete_rule);           //                     //
    router.post("/rule/add_rule_many_agent", AuthenticateJWT.adminAuth, ruleController.add_rule_many_agent);
    router.post("/rule/update", AuthenticateJWT.adminAuth, ruleController.update_rule);                      //
    router.post("/rule/update_state", AuthenticateJWT.adminAuth, ruleController.update_rule_state);          //
    router.post("/rule/save_agent", AuthenticateJWT.adminAuth, ruleController.write_rule_to_agent);          //
    // router.post("/rule/add_rule", ruleController.add_rule);  


    //agent
    router.get("/agent/read_all", AuthenticateJWT.adminAuth, agentController.read_all);
    router.delete("/agent/delete/:agent_id", AuthenticateJWT.adminAuth, agentController.delete_agent);                 //
    router.post("/agent/add", AuthenticateJWT.adminAuth, agentController.add_agent);                                   //
    router.post("/agent/update/:agent_id", AuthenticateJWT.adminAuth, agentController.update_agent);                   //
    router.post("/agent/get_status", AuthenticateJWT.adminAuth, agentController.get_status_agent)                       //
    // router.post("/agent/update_apikey/:agent_id", agentController.update_agent_apikey);     //
    // router.get("/agent/read_all_connect", agentController.read_all_connect);                                  //

    //user, authenticate, authoriry
    router.post("/user/login", userController.login)                      // trả về role, user_id, name, token chứa thông tin role
    //admin
    router.post("/user/add_user", AuthenticateJWT.adminAuth, userController.add_user)                                  //done  
    router.post("/user/update_info_user/:user_id", AuthenticateJWT.adminAuth, userController.update_info_user)        //done  
    router.post("/user/update_state_user/:user_id", AuthenticateJWT.adminAuth, userController.update_state_user)        //done            
    router.post("/user/change_pass/:user_id", AuthenticateJWT.adminAuth, userController.update_password_user)          //done
    router.get("/user/read_all", AuthenticateJWT.adminAuth, userController.read_all)                                   //done
    router.delete("/user/delete/:user_id", AuthenticateJWT.adminAuth, userController.delete_user);                  //done
    //viewer
    router.post("/user/viewer/update_info", AuthenticateJWT.auth, userController.update_info)         // done
    router.post("/user/viewer/change_pass", AuthenticateJWT.auth, userController.update_password)         // done
    router.get("/jwt", AuthenticateJWT.auth, alertController.info)

    // router.get("/test", AuthenticateJWT.adminAuth, (req, res) => {
    //     res.send(`WELCOME TO `);
    // });
    //alert
    router.post("/alert/get_all/:page", AuthenticateJWT.auth, alertController.read_all)
    router.post("/alert/statis_time", AuthenticateJWT.auth, alertController.statis_time)
    router.post("/alert/statis_sid", AuthenticateJWT.auth, alertController.statis_sid)
}




