exports.run = (bot, msg, args) => {
  bot.emit("guildMemberAdd", msg.member)
};