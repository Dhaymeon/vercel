let { Router } = require("express");
const {
  sendMoneyController,
  addMoneyController,
  requestMoneyController,
  fetchNotificationController,
  decisionController,
} = require("./t-controller");
let route = Router();

route.post("/send-money", sendMoneyController);

route.post("/add-money", addMoneyController);

route.post("/request-money", requestMoneyController);

route.post("/fetch-notifications", fetchNotificationController);

route.post("/accept-decline-request", decisionController);

module.exports = route;
