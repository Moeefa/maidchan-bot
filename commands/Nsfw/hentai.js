const Discord = require("discord.js");
const fetch = require('node-fetch');

exports.run = (bot, msg, args) => {
  if (msg.guild) {
    if (!msg.channel.nsfw) return msg.channel.send(`${msg.author}, Você só pode usar esse comando em canais NSFW!`)
  }
  
  fetch(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${args.join("+") || "1girl"}&limit=90000000000`).then(res => res.json())
  .then(json => {
    json = json.filter(e => {
      return e.rating !== "s" && !e.file_url.endsWith(".webm")
    });
    let value = Math.floor(Math.random() * json.length);
    
    json.forEach(i => console.log(i.rating));
    
    msg.channel.send(new Discord.MessageEmbed()
                     .setImage(`${json[value].file_url}`)
                     .setColor('RANDOM')
                     .setDescription(`[Link](${json[value].file_url})`)
                    );
  }).catch(err => {
    return msg.channel.send('Não encontrei nada!')
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'hentai',
  category: 'NSFW',
  description: 'Comando para se mast*.',
  usage: 'hentai [opcional: tag]',
};
