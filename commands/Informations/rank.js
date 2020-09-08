const Level = require('../../schemas/level.js');
const Global = require('../../schemas/globalRank.js');

const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args) => {
  client.embed = (channel, message, timer) => {
      channel = channel.channel || channel;
    
      channel.send(message).then(msg => {
        if (!isNaN(timer)) msg.delete(timer);
      });
    }
  
  Level.find({ guildID: message.guild.id }, {}).sort({ "level" : -1, "xp" : -1 }).then(a => {
    if (message.mentions.members.first() || (args[0] && message.guild.member(args[0]))) {
      var member = message.mentions.members.first() || (args[0] && message.guild.member(args[0]));
      if (member.user.bot) return client.embed(message.channel, `${message.author}, Para não atrapalhar o rank no servidor, eu e outros bots não têm rank.`)
      if (member.user.id === message.author.id && !a.filter(b => message.guild.member(b.userID)).find(b => b.userID === member.id)) return client.embed(message.channel, `${message.author.tag}, você não está no rank.`);
      if (member.user.id === message.author.id) return client.embed(message.channel, `${message.author}, A sua posição no rank é: ${a.filter(b => message.guild.member(b.userID)).findIndex(b => b.userID === member.id) + 1}.`);
      if (!a.filter(b => message.guild.member(b.userID)).find(b => b.userID === member.id)) return client.embed(message.channel, `${message.author}, o(a) ${member} não está no rank.`);
      client.embed(message.channel, `${message.author}, o(a) ${member} está em ${a.filter(b => message.guild.member(b.userID)).findIndex(b => b.userID === member.id) + 1}° no rank!`);
      return;
    };
    
    const embed = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setColor('RANDOM');
    
    var output = '';
    if (isNaN(args[0] || 1)) args[0] = 1;
    if (Number(args[0] || 1) <= -1) return message.channel.send("Use um número maior que 0!");
    if (Number(args[0] || 1) == 0) args[0] = 1;
    var o = Number(args[0] || 1) * 10 - 10;
    for (var i = Number(args[0] || 1) * 10 - 10; i < a.length; i++) {
      if (o === Number(args[0] || 1) * 10) break;
      o++;
      console.log(o, i);
      if (message.guild.member(a[i].userID)) {
        if (o == Number(args[0] || 1) * 10 - 9) {
          embed.setTitle(`${o}. \`${message.guild.member(a[i].userID).user.username}\`: ${a[i].level}`)
          embed.setThumbnail(message.guild.member(a[i].userID).user.displayAvatarURL())
        } else {
          output += `${o}. \`\`${message.guild.member(a[i].userID).user.username}\`\`: ${a[i].level}\n`;
        }
      } else {
        console.log(o, i, "Out!")
        o--;
      };
    };
    embed.setDescription(a.length <= 0 ? "Este servidor não tem rank!" : output == "" && !embed.title ? "Essa página não há pessoas no rank!" : output)
    embed.setFooter(`${(!a.filter(b => message.guild.member(b.userID)).find(b => b.userID === message.author.id)) ? `${message.author.tag}, você não está no rank.` : `${message.author.tag}, você está em ${a.filter(b => message.guild.member(b.userID)).findIndex(b => b.userID === message.author.id) + 1}° no rank.`}`, message.author.displayAvatarURL())
    message.channel.send(embed);
  });
};