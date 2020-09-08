const mongoose = require('mongoose');

const levelSchema = mongoose.Schema({
  userID: String,
  userTag: String,
  guildID: String,
  level: Number,
  xp: Number
});

module.exports = mongoose.model("Level", levelSchema)