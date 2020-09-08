const Discord = require('discord.js')
module.exports = (bot, msg, args) => {
  bot.user.setActivity("Estou online de novo!", { type: "STREAMING" });
  setTimeout(() => {
    bot.updatePresence()
  }, 10000)
  setInterval(() => {
    bot.updatePresence();
  }, 120000);
  console.log("Connected as " + bot.user.username)
}