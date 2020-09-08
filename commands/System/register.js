const User = require('../../schemas/users.js');

module.exports.run = (client, message, args) => {
  User.findOne({ userID: message.author.id }, async (err, user) => {
    if (user) return message.channel.send("Pelo visto, você já está registrado(a) na minha database!");
    const newUser = new User({
      userID: message.author.id,
      username: message.author.username
    });
    newUser.save().catch().then(async () => {
      message.channel.send("Te registrei na minha database!")
    });
  });
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

module.exports.help = {
  name: 'register',
  category: 'Importante',
  description: 'Registra você na database, assim poderá receber xp, level, etc.',
  endescription: 'Register you in database, so you can get xp, level, etc.',
  usage: 'register',
  enusage: 'register'
};