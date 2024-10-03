let {Router} = require("express");
const {loginController, signupController, signupController2, resetPassword, RequestOTPController, changeDetails} = require("./controller");

let route = Router()


route.post("/login", loginController)

route.post("/signup", signupController)

route.post("/changePassword", resetPassword)

route.post ("/signup2", signupController2)

route.post("/requestOTP", RequestOTPController)

route.post("/changeDetails", changeDetails)

// route.post("/verifyOTP", verifyOTP)


module.exports = route;