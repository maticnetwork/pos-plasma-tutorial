const mongoose = require("mongoose");

const txSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    required: true,
    default: "watched",
  },
  oldHash: String,
  newHash: String,
  timestamp: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  lastCall: {
    type: Object,
    default: null,
  },
});

module.exports = mongoose.model("Transaction", txSchema);
