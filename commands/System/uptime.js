const Discord = require('discord.js')
exports.run = async (bot, msg, args) => {
  let totalSeconds = (bot.uptime / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
    
  msg.channel.send(`Estou online faz ${hours}h ${minutes}m ${seconds}s!`)
}