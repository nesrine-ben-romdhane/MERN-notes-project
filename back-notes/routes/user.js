module.exports = app =>{
    const userController = require("../controllers/UserControllers")
    const authuser = require("../middleware/verifyJWT")

    var router = require("express").Router()
    router.use(authuser)
    router.post("/createUser",userController.createNewuser)
    router.get("/alluser",userController.getalluser)
    router.patch("/updateUser/:id",userController.updateUser)
    router.delete("/deleteUser/:id",userController.deleteUser)
app.use("/user",router)
}