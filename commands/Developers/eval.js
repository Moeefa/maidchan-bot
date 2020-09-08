const moment = require('moment'),
      Discord = require('discord.js');

exports.run = async (client, message) => {
  const { MessageEmbed } = require('discord.js');
  
  function clean(text) {
    if (typeof(text) === "string") {
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
      return text;
    };
  };
  
  const config = client.config;
  const args = message.content.split(" ").slice(1);
  const code = args.join(" ");

  try {
    let evaled = eval(code);

    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

    const embed = new MessageEmbed()
    .setDescription('Sucesso, Nilce!')
    .setColor('RANDOM')
    .addField('Entrada 📥', `\`\`\`js\n${code}\n\`\`\``)
    .addField('Saida 📤', `\`\`\`xl\n${clean(evaled)}\n\`\`\``);
      
    message.channel.send(embed).then(embedd => { setTimeout(() => { embedd.delete(); }, 25000) });
  } catch (err) {
    const embederr = new MessageEmbed()
    .setDescription('Mulher de pouca fé!')
    .setColor('RANDOM')
    .addField('Entrada 📥', `\`\`\`js\n${code}\n\`\`\``)
    .addField('Saida 📤', `\`\`\`xl\n${clean(err)}\n\`\`\``);
      
    message.channel.send(embederr).then(embedd => { setTimeout(() => { embedd.delete(); }, 25000) });
  };
};