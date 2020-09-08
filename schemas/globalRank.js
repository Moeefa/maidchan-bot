const mongoose = require('mongoose');

const globalSchema = mongoose.Schema({
  userID: String,
  userTag: String,
  level: Number,
  xp: Number
});

module.exports = mongoose.model("GlobalRank", globalSchema)