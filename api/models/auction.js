const mongoose = require("mongoose");
const auctionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startPrice: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: false }],
  bids: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Bid" }],
  //user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Auction", auctionSchema);
