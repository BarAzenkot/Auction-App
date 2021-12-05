const mongoose = require("mongoose");
const Auction = require("../models/auction");
const Bid = require("../models/bid");
const User = require("../models/user");
const { setABid } = require("./bids");

module.exports = {
  getAllAuctions: (req, res) => {
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
  createNewAuction: (req, res) => {
    const images = req.files.map((file) => file.path);
    const { title, description, startDate, endDate, startPrice, category } =
      req.body;

    const auction = new Auction({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      startDate,
      endDate,
      startPrice,
      category,
      images,
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
    Auction.findById(auctionID)
      .then((auction) => {
        if (!auction) {
          return res.status(404).json({
            message: "Auction not found!",
          });
        }
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
        // .catch((err) => {
        //   res.status(500).json({ err });
        // });
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
};
