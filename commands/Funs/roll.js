exports.run = (client, message, args) => {
  var sides = args[0];
  if (!sides) return message.channel.send("Você esqueceu de adicionar o número que quer tirar?");
  if (sides > 6) return message.channel.send("Você não pode escolher mais que 6! Um dado tem 6 lados, certo?");
  if (sides < 0) return message.channel.send("Você não pode escolher 0 ou menos!");

  if (Number.isInteger(Number(sides))) { 
    var y = (Math.floor(Math.random() * 6) + 1);
    return message.channel.send(`🎲 Você tirou um ${y}!`);
  } else {
    return message.channel.send("It seems you added some letters into your number. Please try again!");
  };
};

exports.help = {
  description: "Roll a dice!",
  usage: "roll <Number>"
}