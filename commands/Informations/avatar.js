const Discord = require('discord.js')
exports.run = (bot, msg, args) => {
  var user = msg.mentions.users.first() || msg.author;
  var msgs = [`Stalkeando? Tanto faz, aqui está. Ou [clique aqui](${user.displayAvatarURL({ size: 2048, dynamic: true })}).`, `Aqui está! Ou [clique aqui](${msg.author.displayAvatarURL({ size: 2048, dynamic: true })}).`]
  var botmsgs = [`Tem como você parar de stalkear o [meu avatar](${user.displayAvatarURL({ size: 2048, dynamic: true })})?`]
  msg.channel.send(new Discord.MessageEmbed()
                   .setColor(bot.config.PrimaryColor) 
                   .setDescription(user.id == bot.user.id ? botmsgs[Math.floor(Math.random() * botmsgs.length)] : msgs[Math.floor(Math.random() * msgs.length)])
                   .setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
                  )

}