const mongoose = require("mongoose");

const bidSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Auction",
  },
  //   user: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     required: true,
  //     ref: "User",
  //   },
});

module.exports = mongoose.model("Bid", bidSchema);
