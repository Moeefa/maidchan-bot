const User = require('../../schemas/users.js');

exports.run = (bot, msg, args) => {
  if (!args[0] || args[0] !== "yes") return msg.channel.send("Se você tem certeza que deseja apagar os seus dados, coloque \"yes\" na frente do comando.");
  User.deleteOne({ userID: msg.author.id }, (err, result) => {
    if (!result) return msg.channel.send("Não o encontrei na database!");
    msg.channel.send("Deletei os seus dados da database!");
  });
};