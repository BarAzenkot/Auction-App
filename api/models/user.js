const mongoose = require("mongoose");
require("mongoose-type-email");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: mongoose.SchemaTypes.Email, required: true },
  fullName: { type: String, required: true },
  bids: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: "Bid" }],
  auctions: [
    { type: mongoose.Schema.Types.ObjectId, required: false, ref: "Auction" },
  ],
  //payment??????
});

module.exports = mongoose.model("User", userSchema);
