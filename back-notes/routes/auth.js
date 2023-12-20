module.exports = app => {
    const auth = require("../controllers/authController")
   
  
    var router = require("express").Router();
    router.post("/login",auth.login);
    router.post("/logout",auth.logout)
    router.get("/refresh",auth.refresh)
     app.use('/auth', router);
}