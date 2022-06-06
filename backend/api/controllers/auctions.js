const mongoose = require("mongoose");
const Auction = require("../models/auction");
const Bid = require("../models/bid");
const User = require("../models/user");
const { setABid } = require("./bids");

module.exports = {
  getAllAuctions: (req, res) => {
    const today = new Date();
    console.log(req.user);
    Auction.find({ endDate: { $gt: today } })
      .then((auctions) => {
        console.log(auctions[0].endDate);
        console.log(today);
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
    console.log("INSIDE createNewAuction(): ", req.body);

    const images = req.body.body.images;
    const { title, description, startDate, endDate, startPrice, category } =
      req.body.body;
    const userID = req.body.user.id;

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
    console.log("AFTER Auction creation: ", auction);
    User.findById(userID).then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      user.auctions.push(auction);
      user.save();
    });
    console.log("AFTER PUSH AUCTION TO THE USER");

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
          Bid.findById(auction.bids[auction.bids.length - 1]).then(
            (currentBid) => {
              currentBid && currentBid.amount < bid.amount
                ? auction.bids.push(bid)
                : auction.bids.unshift(bid);
              auction.save();
              res.status(200).json({
                message: `a new offer for auction - ${auctionID}`,
                NumOfBids: auction.bids.length,
              });
            }
          );
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  // offerAShadowBid: (req, res) => {
  //   const auctionID = req.params.auctionID;
  //   console.log("\n\n\nhere\n\n\n");
  //   Auction.findById(auctionID)
  //     .then(async (auction) => {
  //       if (!auction) {
  //         return res.status(404).json({
  //           message: "Auction not found",
  //         });
  //       }
  //       const bidID = await setABid(req, res);
  //       Bid.find(bidID).then((bid) => {
  //         auction.shadowBid = bid;
  //         auction.save();
  //         res
  //           .status(200)
  //           .json({ message: `a new shadow offer for auction - ${auctionID}` });
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ err });
  //     });
  // },
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
  payment: (req, res) => {
    const auctionID = req.params.auctionID;
    let bidAmount;
    console.log(auctionID);
    Auction.findById(auctionID).then((auction) => {
      if (!auction) {
        return res.status(404).json({
          message: "Auction not found",
        });
      }
      if (auction.endDate > Date.now()) {
        return res.status(100).json({
          message: "Auction still on air",
        });
      }
      const bidID = auction.bids[auction.bids.length - 1];
      Bid.findById(bidID).then((bid) => {
        if (!bid) {
          return res.status(404).json({
            message: "Bid not found",
          });
        }
        if (bid.expired) {
          res.status(500).json({
            message: `The auction - '${auction.title}' already been sold.`,
          });
        } else {
          console.log("continue");
          bidAmount = bid.amount;
          bid.expired = true;
          bid.save();
          const sellerID = auction.user;
          User.findById(sellerID).then((seller) => {
            if (!seller) {
              return res.status(404).json({
                message: "Seller not found",
              });
            }
            seller.coins += bidAmount;
            seller.save();
            res.status(200).json({
              message: `The auction - '${auction.title}' has been expired and the product sold. Now you got ${seller.coins}`,
            });
          });
        }
      });
    });
  },
};
