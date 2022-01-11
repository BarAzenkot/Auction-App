const mongoose = require("mongoose");
const Auction = require("../models/auction");
const Bid = require("../models/bid");
const User = require("../models/user");
const { setABid } = require("./bids");

module.exports = {
  getAllAuctions: (req, res) => {
    console.log(req.user);
    Auction.find()
      .then((auctions) => {
        res.status(200).json({
          auctions,
        });
      })
      .catch((err) => {
        res.status(500).json({
          err,
        });
      });
  },
  createNewAuction: async (req, res) => {
    // res.json({ file: req.files });
    const images = req.files.map((file) => file.filename);
    const { title, description, startDate, endDate, startPrice, category } =
      req.body;
    const userID = req.user.id;

    const auction = new Auction({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      startDate,
      endDate,
      startPrice,
      category,
      images,
      user: userID,
    });

    User.findById(userID).then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      user.auctions.push(auction);
      user.save();
    });

    auction
      .save()
      .then(() => {
        res.status(200).json({
          message: "a new auction created",
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  updateAuction: (req, res) => {
    const auctionID = req.params.auctionID;
    Auction.findById(auctionID)
      .then((auction) => {
        if (!auction) {
          return res.status(404).json({
            message: "Auction not found!",
          });
        }
        Auction.updateOne({ _id: auctionID }, req.body).then(() => {
          res.status(200).json({
            message: `Update auction - ${auctionID}`,
          });
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  deleteAuction: (req, res) => {
    const auctionID = req.params.auctionID;
    const userID = req.user.id;

    Auction.findById(auctionID)
      .then((auction) => {
        if (!auction) {
          return res.status(404).json({
            message: "Auction not found!",
          });
        }
        User.findById(userID).then((user) => {
          user.auctions = user.auctions.filter(
            (auc) => auc.toString() !== auctionID
          );
          user.save();
        });
        Auction.deleteOne({ _id: auctionID }).then(() => {
          res.status(200).json({
            message: `Auction - ${auctionID} has been deleted`,
          });
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  getOneAuction: (req, res) => {
    const auctionID = req.params.auctionID;
    Auction.findById(auctionID)
      .then((auction) => {
        res.status(200).json({
          auction,
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  offerABid: (req, res) => {
    const auctionID = req.params.auctionID;
    Auction.findById(auctionID)
      .then(async (auction) => {
        if (!auction) {
          return res.status(404).json({
            message: "Auction not found",
          });
        }
        const bidID = await setABid(req, res);
        Bid.findById(bidID).then((bid) => {
          auction.bids.push(bid);
          auction.save();
          res
            .status(200)
            .json({ message: `a new offer for auction - ${auctionID}` });
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  offerAShadowBid: (req, res) => {
    const auctionID = req.params.auctionID;
    Auction.findById(auctionID)
      .then(async (auction) => {
        if (!auction) {
          return res.status(404).json({
            message: "Auction not found",
          });
        }
        const bidID = await setABid(req, res);
        Bid.find(bidID).then((bid) => {
          auction.shadowBid = bid;
          auction.save();
          res
            .status(200)
            .json({ message: `a new shadow offer for auction - ${auctionID}` });
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  getByCategory: (req, res) => {
    const category = req.params.categoryID;
    Auction.find({ category: category })
      .then((auctions) => {
        res.status(200).json({
          auctions,
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  deleteAllAuctions: (req, res) => {
    Auction.deleteMany({ title: { $ne: "" } })
      .then(() => {
        res.status(200).json({
          message: `All auctions has been deleted`,
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
};
