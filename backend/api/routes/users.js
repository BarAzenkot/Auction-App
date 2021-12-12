const express = require("express");
const router = express.Router();

const { signup, login, getOneUser } = require("../controllers/users");

router.post("/signup", signup);
router.post("/login", login);
router.get("/:userID", getOneUser);

module.exports = router;