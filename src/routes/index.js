module.exports = (router) => {
    const ruleController = require('../controllers/rule.controller');
    const alertController = require('../controllers/alert.controller');
    const agentController = require('../controllers/agent.controller');
    const userController = require('../controllers/user.controller')
    // const AuthenticateAPIKey = require('../Policy/AuthenticateAPIKey');
    const AuthenticateJWT = require('../Policy/AuthenticateJWT')
    /// đối với api có áp dụng jwt phải gửi kèm user_id


    ///////////////////////////////////rule cua agent
    //rule
    // router.get("/agent/rule/read", ruleController.get_rule_agent)            //chưa dùng tới
    // router.post("/agent/rule/write", AuthenticateAPIKey.check_apikey, ruleController.save_rule_agent);        //
    // router.get("/agent/check_apikey", AuthenticateAPIKey.check_apikey, agentController.test_api);



    ///////////////////rule cua manager
    router.get("/rule/read_all/:agent_id", ruleController.read_all);              //
    router.delete("/rule/delete/:rule_id", ruleController.delete_rule);           //
    router.post("/rule/add_rule", ruleController.add_rule);                       //
    router.post("/rule/add_rule_many_agent", ruleController.add_rule_many_agent);
    router.post("/rule/update", ruleController.update_rule);                      //
    router.post("/rule/update_state", ruleController.update_rule_state);          //
    router.post("/rule/save_agent", ruleController.write_rule_to_agent);          //


    //agent
    router.get("/agent/read_all", agentController.read_all);
    router.get("/agent/read_all_connect", agentController.read_all_connect);                                  //
    router.delete("/agent/delete/:agent_id", agentController.delete_agent);                 //
    router.post("/agent/add", agentController.add_agent);                                   //
    router.post("/agent/update/:agent_id", agentController.update_agent);                   //
    router.post("/agent/update_apikey/:agent_id", agentController.update_agent_apikey);     //
    router.post("/agent/get_status", agentController.get_status_agent)                       //

    //user, authenticate, authoriry
    router.post("/user/login", userController.login)                      // trả về role, user_id, name, token chứa thông tin role
    //admin
    router.post("/user/add_user", userController.add_user)                                  //done  
    router.post("/user/update_info_user/:user_id", userController.update_info_user)        //done  
    router.post("/user/update_state_user/:user_id", userController.update_state_user)        //done            
    router.post("/user/change_pass/:user_id", userController.update_password_user)          //done
    router.get("/user/read_all", userController.read_all)                                   //done
    router.delete("/user/delete/:user_id", userController.delete_user);                  //done
    //viewer
    router.post("/user/viewer/update_info", userController.update_info)         // done
    router.post("/user/viewer/change_pass", userController.update_password)         // done
    router.get("/jwt", AuthenticateJWT.auth, alertController.info)

    router.get("/test", (req, res) => {
        res.send("WELCOME TO THE BASIC APP WITH AN HTTPS SERVER");
    });
    //alert
    router.post("/alert/get_all/:page", alertController.read_all)
    router.post("/alert/statis_time", alertController.statis_time)
    router.post("/alert/statis_sid", alertController.statis_sid)
}




