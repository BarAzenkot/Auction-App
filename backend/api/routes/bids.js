const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth.js");
const { deleteAllBids, getOneBid } = require("../controllers/bids");

router.get("/:bidID", /*checkAuth,*/ getOneBid);
router.delete("/", /*checkAuth,*/ deleteAllBids); // for developers' comfort.

module.exports = router;
