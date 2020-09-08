const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  userID: String,
  username: String,
  money: Number,
  background: String,
  ownBackgrounds: Array,
  badge1: String,
  badge2: String,
  badge3: String,
  badge4: String,
  badge5: String,
  badge6: String,
  badge7: String,
  badge8: String,
  gday: Date
});

module.exports = mongoose.model("Users", usersSchema)
