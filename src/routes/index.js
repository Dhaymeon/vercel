let { Router } = require("express");
let route = Router();

route.use("/auth", require("../auth/route"));

route.use("/transactions", require("../transactions/t-route.js"));

route.use("/user", require("../user/user-route.js"));

module.exports = route;
