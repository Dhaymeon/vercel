let { Router } = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const {
  GetLoggedInUserController,
  refreshAccessController,
  deleteUserController,
  uploadFileController,
} = require("./user-controller");
let route = Router();

route.get("/loggedInUser", GetLoggedInUserController);

route.post("/refresh-access", refreshAccessController);

route.post("/deleteUser", deleteUserController);

route.post("/upload-photo", upload.single("file"), uploadFileController);

module.exports = route;
