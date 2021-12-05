const mongoose = require("mongoose");
const Bid = require("../models/bid");
const User = require("../models/user");

module.exports = {
  setABid: async (req, res) => {
    const { amount } = req.body;
    const auctionID = req.params.auctionID;
    const userID = req.user.id;

    const bid = new Bid({
      _id: new mongoose.Types.ObjectId(),
      amount,
      auction: auctionID,
      user: userID,
    });

    User.findById(userID).then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      user.save();
    });
    await bid.save();
    return await bid;
  },
  deleteAllBids: async (req, res) => {
    Bid.deleteMany({ amount: { $gt: 0 } })
      .then(() => {
        res.status(200).json({
          message: `All bids has been deleted`,
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
};
