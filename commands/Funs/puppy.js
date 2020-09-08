const randomPuppy = require('random-puppy');

exports.run = (bot, msg, args) => {
  randomPuppy().then(url => {
    msg.channel.send("Aqui está a foto de um cachorrinho fofinho!\n" + url)
  })
};