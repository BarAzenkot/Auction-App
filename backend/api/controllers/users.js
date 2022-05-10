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

    User.findById(userID)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }
        res.status(200).json({
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
  getUserBids: (req, res) => {
    const userID = req.user.id;
    console.log("THIS IS USER: ", userID);
    User.findById(userID).then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const bids = user.bids;
      res.status(200).json({
        bids,
      });
    });
  },
  refund: (req, res) => {
    const userID = req.user.id;
    console.log("THIS IS USER: ", userID);
    User.findById(userID)
      .then((user) => {
        const bids = user.bids;
        console.log(bids);
        if (bids.length) {
          bids.map((bidID) => {
            Bid.findById(bidID).then((bid) => {
              if (bid === null) return;
              Auction.findById(bid.auction).then((auction) => {
                console.log("before: ", user.coins);
                if (bid.id !== auction.bids[0] && bids.includes(bid.id)) {
                  // auction.endDate < new Date();
                  user.coins += bid.amount;
                  auction.bids = auction.bids.filter(
                    (item) => bid.id !== item.toString()
                  );
                  auction.save();
                  console.log("after: ", user.coins);

                  // console.log("--- ", bid.amount);
                  // console.log(auction.bids[0]);
                }
              });
            });
          });
          user.save();
          res.status(200).json({
            bids,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  },
};
