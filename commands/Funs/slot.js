const slots = ['🍇', '🍊', '🍐', '🍒', '🍋'];
const { MessageEmbed } = require('discord.js')

const User = require('../../schemas/users.js');

exports.run = async (bot, msg, args) => {
  User.findOne({ userID: msg.author.id }, async (err, user) => {
    if (!user || !user.money || user.money === null || user.money < 10) return msg.channel.send('Você não tem 🎟 suficientes!')
    
    const embed = new MessageEmbed()
    .setDescription('Certeza de que quer continuar? Se você perder, perderá 10 🎟. Caso queira, reaja no emoji abaixo. Caso não queira, ignore esta mensagem.\nA mensagem expira em 2 minutos')
    .setColor('RANDOM')
    const message = await msg.channel.send(embed)
    message.react('🎟')
    const backwardsFilter = (reaction, user) => reaction.emoji.name === '🎟' && user.id === msg.author.id;
    const backwards = message.createReactionCollector(backwardsFilter, { time: 120000 });
  
    backwards.on('collect', async r => {
      await message.delete();
   
      const slotOne = slots[Math.floor(Math.random() * slots.length)];
      const slotTwo = slots[Math.floor(Math.random() * slots.length)];
      const slotThree = slots[Math.floor(Math.random() * slots.length)];
      if (slotOne === slotTwo && slotOne === slotThree) {
        const embed = new MessageEmbed()
        .setDescription(`▫ ${slots[Math.floor(Math.random() * slots.length)]} | ${slots[Math.floor(Math.random() * slots.length)]} | ${slots[Math.floor(Math.random() * slots.length)]} ▫\n▶ ${slotOne} | ${slotTwo} | ${slotThree} ◀\n▫ ${slots[Math.floor(Math.random() * slots.length)]} | ${slots[Math.floor(Math.random() * slots.length)]} | ${slots[Math.floor(Math.random() * slots.length)]} ▫`)
        .setTitle('Você ganhou 30 tickets! 🎰')
        .setColor('RANDOM')
        .setFooter(`Comando requisitado por: ${msg.author.tag}`, msg.author.avatarURL)
        msg.channel.send(embed)
        let coinstoadd = 30
        const newMoney = new User({
          username: msg.author.username,
          userID: msg.author.id,
          money: user.money + coinstoadd
        });
        newMoney.save().catch()
      } else {
        const embed = new MessageEmbed()
        .setDescription(`▫ ${slots[Math.floor(Math.random() * slots.length)]} | ${slots[Math.floor(Math.random() * slots.length)]} | ${slots[Math.floor(Math.random() * slots.length)]} ▫\n▶ ${slotOne} | ${slotTwo} | ${slotThree} ◀\n▫ ${slots[Math.floor(Math.random() * slots.length)]} | ${slots[Math.floor(Math.random() * slots.length)]} | ${slots[Math.floor(Math.random() * slots.length)]} ▫`)
        .setTitle('Você não ganhou...')
        .setColor('RANDOM')
        .setFooter(`Comando requisitado por: ${msg.author.tag}`, msg.author.avatarURL)
        msg.channel.send(embed)
        const newMoney = new User({
          username: msg.author.username,
          userID: msg.author.id,
          money: user.money - 10
        });
        newMoney.save().catch()
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
  name: 'slot',
  category: 'Diversão',
  description: 'É um slot que você precisa obter todos iguais (igual aqueles de casino).',
  endescription: 'It\'s a slot that you need to get all equals (is like that from casino).',
  usage: 'slot',
  enusage: 'slot'
};