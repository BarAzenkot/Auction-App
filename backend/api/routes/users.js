const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth.js");

const {
  signup,
  login,
  getOneUser,
  chargeCoins,
  refund,
} = require("../controllers/users");

router.post("/signup", signup);
router.post("/login", login);
router.get("/:userID", getOneUser);
router.post("/:userID/charge", checkAuth, chargeCoins);
router.get("/:userID/refund", checkAuth, refund);

module.exports = router;
