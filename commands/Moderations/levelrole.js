const Guild = require('../../schemas/guilds');

module.exports.run = (client, message, args) => {
  var role = message.mentions.roles.first() || message.guild.roles.get(args[0]);
  var level = args[1];
  if (isNaN(level)) return message.channel.send("O level necessita ser números.")
  
  Guild.findOne({ guildID: message.guild.id }, (err, result) => {
    if (!result) {
      if (args[2] && args[2] === "remove") return message.channel.send(`Este servidor não há cargos para remover.`)
      const newGuild = Guild({
        levelroles: [{level: level, role: role.id}]
      });
      newGuild.save().then(message.channel.send(`Irei adicionar o cargo \`\`${role.name}\`\` para o level \`\`${level}\`\`.`));
    } else {
      if (!result.levelroles) result.levelroles = [];
      if (args[2] && args[2] === "remove") {
        if (result.levelroles.some(a => (message.mentions.roles.first() || message.guild.roles.get(args[0])) ? a.level === level || a.role === role.id : a.level === level)) {
          var objIndex = result.levelroles.findIndex(a => (message.mentions.roles.first() || message.guild.roles.get(args[0])) ? a.level === level || a.role === role.id : a.level === level);
          var roleid = result.levelroles[objIndex].role
          var oldlevel = result.levelroles[objIndex].level
          result.levelroles.splice(objIndex, 1);
          result.save().then(message.channel.send(`Não irei adicionar o cargo \`\`${message.guild.roles.get(roleid).name}\`\` ao upar para o level \`\`${oldlevel}\`\` novamente.`))
        } else {
          message.channel.send(`Não encontrei este cargo ou level!`)
        };
        return;
      };
      
      if (result.levelroles.some(a => a.level === level || a.role === role.id)) {
        var objIndex = result.levelroles.findIndex((obj => obj.role === role.id));
        result.levelroles[objIndex].level = level;
        result.levelroles[objIndex].role = role.id;
        result.save().then(message.channel.send(`\`\`${role.name}\`\` Foi atualizado para o level \`\`${level}\`\`.`));
        return;
      };
      
      result.levelroles.push({level: level, role: role.id})
      result.save().then(message.channel.send(`Irei adicionar o cargo \`\`${role.name}\`\` para o level \`\`${level}\`\`.`));
    };
  });
};

module.exports.conf = {
  guildOnly: true,
  memberPermNeeded: ["MANAGE_MESSAGES"]
};

module.exports.help = {
  description: 'Adiciona cargo quando a pessoa chega em certo level.',
  endescription: 'Add role when someone reach a specific level.',
  usage: 'levelrole <menção do cargo|ID do cargo> <level> [remove]',
  enusage: 'levelrole <role mention|role ID> <level> [remove]' // Syntax: <> = required, [] = optional, | = options.
};