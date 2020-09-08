const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
  guildID: String,
  prefix: String,
  lang: String,
  welcome: String,
  goodbye: String,
  hentaitimer: Date
});

module.exports = mongoose.model("Guilds", guildSchema)
