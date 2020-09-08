const Discord = require('discord.js')
exports.run = async (bot, msg, args) => {
  const m = await msg.channel.send("Ping? 🏓")
  var a = [`Eu consegui? Eu cheguei à tempo?`, `Sério? Eu gastei ${m.createdTimestamp - msg.createdTimestamp}ms com você...`]
  //console.log(await this.lang("PING_RESPONSES"));
  //a = await this.lang("PING_RESPONSES")
  m.edit("", new Discord.MessageEmbed()
         .setColor(bot.config.PrimaryColor)
         .setDescription(`Meu ping é de ${m.createdTimestamp - msg.createdTimestamp}ms!\n` + a[Math.floor(Math.random() * a.length)].format(m.createdTimestamp - msg.createdTimestamp))
         //.addField("Meu ping", `${m.createdTimestamp - msg.createdTimestamp} ms`, true)
         //.addField(await this.lang("PING_API_LATENCY"), `${Math.floor(bot.ping)} ms`, true)
         )
}