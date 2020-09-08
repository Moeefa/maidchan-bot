const moment = require('moment');
const {MessageEmbed} = require('discord.js');

const User = require('../../schemas/users.js');
let chance;

exports.run = async (client, message, args) => {
  User.findOne({ userID: message.author.id }, async (err, user) => {  
    if (!user || !user.money || user.money === null || user.money === undefined || user.money < 10) return client.embed(message.channel, client.lang['INSUFFICIENT_MONEY'])

    if (!args[0]) return client.embed(message.channel, client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_INSERTKEY']);
    let lower = args[0].toLowerCase();
    if (!['cara', 'coroa'].includes(lower)) return client.embed(message.channel, client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_INSERTKEY']);
  
    const embed = new MessageEmbed()
    .setDescription(client.lang['FLIPCOIN_SURE'])
    .setColor('RANDOM')
    const smsg = await message.channel.send(embed)
    smsg.react('🎟')
    const backwardsFilter = (reaction, user) => reaction.emoji.name === '🎟' && user.id === message.author.id;
    const backwards = smsg.createReactionCollector(backwardsFilter, { time: 120000 });
  
    backwards.on('collect', async r => {
      await smsg.delete();
  
      let breakChance = 50
      let broken = Math.floor(Math.random() * (100 - 1 + 1) + 1);
    
      if (broken <= breakChance) {
        if (lower === client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_HEAD']) chance = `${client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_HEAD']}`
        if (lower === client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_TAIL']) chance = `${client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_TAIL']}`
        client.embed(message.channel, client.lang['FLIPCOIN_WIN'].formatUnicorn(chance))
        let coinstoadd = 10;
        user.money = user.money + coinstoadd
        user.save().catch()
      } else {
        if (lower === client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_HEAD']) chance = `${client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_TAIL']}`
        if (lower === client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_TAIL']) chance = `${client.lang['[!IMPORTANT_TRANSLANTE]_FLIPCOIN_HEAD']}`
        client.embed(message.channel, client.lang['FLIPCOIN_LOSE'].formatUnicorn(chance))
        user.money = user.money - 10
        user.save().catch()
      };
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'flipcoin',
  category: 'Diversão',
  description: 'Você precisa acertar para ganhar!',
  endescription: 'You need to guess to win!',
  usage: 'flipcoin [Cara/Coroa]',
  enusage: 'flipcoin [Cara/Coroa]'
};