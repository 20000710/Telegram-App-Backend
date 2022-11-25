const express = require("express");
const router = express.Router();

const auth = require("./auth.route");
const users = require("./users.route")

router
    .use("/auth", auth)
    .use("/users", users)

module.exports = router