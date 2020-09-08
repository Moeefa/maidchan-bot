const Discord = require('discord.js');
const { stripIndents } = require('common-tags');

exports.run = (bot, msg, args) => {
  if (args[0]) {
    getCMD(bot, msg, args[0])
  } else {
    //msg.author.send("Eu vi a sua mensagem no servidor e achei que essas informações poderia te ajudar!")
    getAll(bot, msg);
  }
};

exports.conf = {
  guildOnly: false
}

function getAll(bot, msg) {
  var pages = [],
      page = 1;
  
  const commands = (category) => {
    return bot.commands
      .filter(cmd => cmd.help.category === category)
      .map(cmd => `- \`${cmd.help.name}\``)
      .join('\n');
  }
  
  const info = bot.categories
    .map(cat => pages.push([cat, commands(cat)]))
    .reduce((string, category) => string + "\n" + category);
  
  const embed = new Discord.MessageEmbed()
  .addField("Servidor de suporte:", "https://discord.gg/G3wrqEa")
  .setAuthor(pages[page - 1][0])
  .setDescription(pages[page - 1][1])
  .setFooter(`Página ${page} de ${pages.length}.`)
  .setColor('RANDOM')
    
  msg.author.send(embed).then(smsg => {
    smsg.react('⬅').then(r => {
      smsg.react('➡')

      const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === msg.author.id;
      const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === msg.author.id;

      const backwards = smsg.createReactionCollector(backwardsFilter, {
        time: 300000
      });
      const forwards = smsg.createReactionCollector(forwardsFilter, {
        time: 300000
      });

      backwards.on('collect', r => {
        if (page === 1) return;
        page--;
        embed.setAuthor(pages[page - 1][0])
        embed.setDescription(pages[page - 1][1])
        embed.setFooter(`Página ${page} de ${pages.length}.`)
        embed.setColor('RANDOM')
        smsg.edit(embed)
      })
  
      forwards.on('collect', r => {
        if (page === pages.length) return;
        page++;
        embed.setAuthor(pages[page - 1][0])
        embed.setDescription(pages[page - 1][1])
        embed.setFooter(`Página ${page} de ${pages.length}.`)
        embed.setColor('RANDOM')
        smsg.edit(embed)
      });
    });
  });
};

function getCMD(bot, msg, input) {
  const embed = new Discord.MessageEmbed()
  
  const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));
  
  let info = `No information found for command: ${input.toLowerCase()}`;
  
  if (!cmd) {
    return msg.channel.send(embed.setColor("RED").setDescription(info));
  }
  
  if (cmd.help && cmd.help.name) info = `Command name: ${cmd.help.name}`;
  if (cmd.conf && cmd.conf.aliases) info += `\nAliases: ${cmd.conf.aliases.map(a => `\`${a}\``).join(", ")}`;
  if (cmd.help && cmd.help.description) info += `\nDescription: ${cmd.help.description}`;
  if (cmd.help && cmd.help.usage) {
    info += `\nUsage: ${cmd.help.usage}`;
    embed.setFooter(`Syntax: <> = required, [] = optional, | = options.`);
  }
  
  return msg.channel.send(embed.setColor("GREEN").setDescription(info));
};
