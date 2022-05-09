const mongoose = require("mongoose");
require("mongoose-type-email");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: mongoose.SchemaTypes.Email, required: true, unique: true },
  fullName: { type: String, required: true },
  bids: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: "Bid" }],
  auctions: [
    { type: mongoose.Schema.Types.ObjectId, required: false, ref: "Auction" },
  ],
  coins: { type: Number, required: true },
});

module.exports = mongoose.model("User", userSchema);
