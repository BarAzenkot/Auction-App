const User = require("../models/user");
const Bid = require("../models/bid");
const Auction = require("../models/auction");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bid = require("../models/bid");

module.exports = {
  signup: (req, res) => {
    const { email, password, username, fullName } = req.body;

    User.find({ email }).then((users) => {
      if (users.length > 0) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }
      bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({ error });
        }

        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email,
          password: hash,
          username,
          fullName,
          coins: 0,
        });

        user
          .save()
          .then((result) => {
            res.status(200).json({
              message: "User created successfully",
            });
          })
          .catch((err) => {
            res.status(500).json({ err });
          });
      });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    User.find({ email }).then((users) => {
      if (users.length === 0) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      const [user] = users;
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              id: user._id,
              email: user.email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "365d",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token,
            user: user._id,
          });
        }

        return res.status(401).json({
          message: "Auth failed",
        });
      });
    });
  },
  getOneUser: (req, res) => {
    const userID = req.params.userID;
    console.log("User ID: ", userID);
    console.log("HERE IN getOneUser()");

    User.findById(userID)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }
        return res.status(200).json({
          user,
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  getMyUser: (req, res) => {
    const userID = req.user.id;

    User.findById(userID)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }
        return res.status(200).json({
          user,
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  chargeCoins: (req, res) => {
    const userID = req.params.userID;
    const coins = req.body.coins;

    User.findById(userID)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }
        User.updateOne(
          { _id: userID },
          { $set: { coins: user.coins + coins } }
        ).then(() => {
          res.status(200).json({
            message: `Added ${coins}$ to your wallet. Now u got ${
              user.coins + coins
            }$.`,
          });
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  getAuction: (req, res) => {
    console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE2");

    const bidID = req.params.bidID;
    Bid.findById(bidID)
      .then((bid) => {
        const auction = bid.auction;
        return res.status(200).json({
          auction,
        });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  getUserBids: (req, res) => {
    console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE1");

    const userID = req.user.id;
    User.findById(userID)
      .then((user) => {
        const bids = user.bids;
        return res.status(200).json({ bids });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err });
      });
  },
  updateCoins: (req, res) => {
    const auctionID = req.params.auctionID;
    const userID = req.user.id;
    const bidID = req.params.bidID;
    let coins;
    Auction.findById(auctionID)
      .then((auction) => {
        if (bidID !== auction.bids[0]) {
          Bid.findById(bidID).then((bid) => {
            if (!bid.expired) {
              coins = bid.amount;
              bid.expired = true;
              bid.save();
              User.findById(userID).then((user) => {
                user.coins += bid.amount;
                user.save();
                return res.status(200).json({
                  userID,
                });
              });
            }
            return res.status(100).json({
              message: "No refund required.",
            });
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
  refund: (req, res, bidID, auction) => {
    let coins = 0;
    Bid.findById(bidID)
      .then((bid) => {
        if (bid.id !== auction.bids[0]) {
          coins += bid.amount;
        }
        res.status(200).json({ coins });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err });
      });
  },
  refund2: async (req, res, bid) => {
    const userID = req.user.id;
    console.log("THIS IS USER: ", userID);
    // let coins = 0;
    const bids = await getUserBids(req, res);
    console.log(bids);
    const coins = [];
    User.findById(userID)
      .then((user) => {
        const bids = user.bids;
        console.log(bids);
        if (bids.length) {
          bids.map((bidID) => {
            Bid.findById(bidID).then((bid) => {
              if (bid === null) return;
              Auction.findById(bid.auction).then((auction) => {
                if (bid.id !== auction.bids[0] && bids.includes(bid.id)) {
                  coins.push(bid.amount);
                  console.log(coins);
                  // auction.bids = auction.bids.filter(
                  //   (item) => bid.id !== item.toString()
                  // );
                  // auction.save();
                  // console.log("--- ", bid.amount);
                  // console.log(auction.bids[0]);
                }
              });
            });
          });
        }
      })
      .then(
        console.log(coins)
        // res.status(200).json({
        //   coins,
        // })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err });
      });
  },
};
