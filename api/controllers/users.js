const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

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
        });

        user
          .save()
          .then((result) => {
            res.status(200).json({
              message: "User created successfully",
            });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    User.find({ email }).then((users) => {
      if (users.length === 0) {
        res.status(401).json({
          message: "Auth failed",
        });
        // const [user] = users
        // user[0].
      }
    });
  },
};
