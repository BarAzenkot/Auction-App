const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth.js");

const {
  signup,
  login,
  getOneUser,
  chargeCoins,
  refund,
  getUserBids,
  getAuction,
  updateCoins,
  getUserAuctions,
} = require("../controllers/users");

router.post("/signup", signup);
router.post("/login", login);
router.get("/:userID", getOneUser);
router.post("/:userID/charge", /*checkAuth,*/ chargeCoins);
// router.get("/:userID/refund", checkAuth, refund);
router.get("/:userID/bids", /*checkAuth,*/ getUserBids);
router.get("/:bidID/auction", checkAuth, getAuction);
router.get("/:auctionID/:bidID/refund", checkAuth, updateCoins);
router.get("/:userID/auctions", getUserAuctions);

module.exports = router;
