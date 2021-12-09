const express = require("express");
const router = express.Router();
const { deleteAllBids, getOneBid } = require("../controllers/bids");
const upload = require("../middlewares/upload");
const checkAuth = require("../middlewares/checkAuth.js");
const {
  getAllAuctions,
  createNewAuction,
  updateAuction,
  deleteAuction,
  getOneAuction,
  offerABid,
  getByCategory,
} = require("../controllers/auctions");

router.get("/", checkAuth, getAllAuctions);
router.post("/", checkAuth, upload.array("images", 8), createNewAuction);
router.patch("/:auctionID", checkAuth, updateAuction);
router.delete("/:auctionID", checkAuth, deleteAuction);
router.get("/:auctionID", checkAuth, getOneAuction);
router.post("/:auctionID", checkAuth, offerABid);
router.get("/categories/:categoryID", checkAuth, getByCategory);

module.exports = router;
