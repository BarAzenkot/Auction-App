const express = require("express");
const router = express.Router();
const { deleteAllBids } = require("../controllers/bids");
const upload = require("../middlewares/upload");
const {
  getAllAuctions,
  createNewAuction,
  updateAuction,
  deleteAuction,
  getOneAuction,
  offerABid,
  getByCategory,
} = require("../controllers/auctions");

router.get("/", getAllAuctions);

router.post("/", upload.array("images", 8), createNewAuction);

router.patch("/:auctionID", updateAuction);

router.delete("/:auctionID", deleteAuction);

router.get("/:auctionID", getOneAuction);

router.post("/:auctionID", offerABid); // needs to be changed to POST request

router.get("/categories/:categoryID", getByCategory);

router.delete("/", deleteAllBids); // for developers' comfort.

module.exports = router;
