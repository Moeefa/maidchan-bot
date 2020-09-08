const Discord = require('discord.js')
const embed = new Discord.MessageEmbed()
const Servers = require('../schemas/guilds.js');
/*const pt_BR = require('../langs/pt-BR');
const en_US = require('../langs/en-US');*/
module.exports = async (bot, msg) => {
  if (msg.author.bot) return
  if (msg.author.id === bot.user.id) return
  //if (msg.channel.recipient) return
 
  if (msg.content.indexOf(bot.config.prefix) !== 0) return

  const args = msg.content.slice(bot.config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));

  if (!cmd) return
  if (cmd.help.category == "Developers" && msg.author.id !== "347866212442570762") return;
  if (cmd.conf && cmd.conf.enabled == false) return;
  if (!msg.guild && (cmd.conf && cmd.conf.guildOnly == true)) return msg.author.send("Você só pode usar esse comando em servidores!");
  
  if (cmd.conf && cmd.conf.botPermNeeded && cmd.conf.botPermNeeded.length >= 1) {
      for (var i in cmd.conf.botPermNeeded) {
        if (typeof cmd.conf.botPermNeeded[i] !== "string") continue;
        if (!msg.guild.me.hasPermission(cmd.conf.botPermNeeded[i])) {
          msg.channel.send("</author/>, eu não tenho permissão (</perm/>) para executar esse comando!".replace(/<\/author\/>/g, msg.author).replace(/<\/perm\/>/g, (bot.lang && bot.lang["PERMISSIONS_" + cmd.conf.botPermNeeded[i]]) ? bot.lang["PERMISSIONS_" + cmd.conf.botPermNeeded[i]] : cmd.conf.botPermNeeded[i]));
          return;
        };
      };
    };
  if (cmd.conf && cmd.conf.memberPermNeeded && cmd.conf.memberPermNeeded.length >= 1) {
    for (var i in cmd.conf.memberPermNeeded) {
      if (typeof cmd.conf.memberPermNeeded[i] !== "string") continue;
      if (!msg.member.hasPermission(cmd.conf.memberPermNeeded[i])) {
        msg.channel.send("</author/>, você não tem permissão (</perm/>) para usar esse comando!".replace(/<\/author\/>/g, msg.author).replace(/<\/perm\/>/g, (bot.lang && bot.lang["PERMISSIONS_" + cmd.conf.memberPermNeeded[i]]) ? bot.lang["PERMISSIONS_" + cmd.conf.memberPermNeeded[i]] : cmd.conf.memberPermNeeded[i]));
        return;
      };
    };
  };
  
  cmd.lang = (value) => {
    return new Promise(resolve => {
      Servers.findOne({ guildID: msg.guild.id }).exec().then(result => {
        if (!result || !result.lang) (value) ? resolve(require('../langs/pt-BR')[value]) : resolve(require('../langs/pt-BR'));
        (value) ? resolve(require(`../langs/${result.lang}`)[value]) : resolve(require(`../langs/${result.lang}`));
      });
    });
  };
  
  try {
    cmd.run(bot, msg, args, embed)//.catch(err => { return msg.channel.send(new Discord.MessageEmbed().setColor(bot.config.primaryColor).setDescription("Não consigo rodar esse comando!\nVocê pode mandar esse erro para o meu criador:\n" + err.message)) })
  } catch (err) {
    console.error(err)
    return msg.channel.send(new Discord.MessageEmbed().setColor(bot.config.primaryColor).setDescription("Não consigo rodar esse comando!\nVocê pode mandar esse erro para o meu criador:\n```" + err.message + "```"));
  }
}