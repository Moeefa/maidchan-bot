const { version, MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (bot, msg, args) => {
  let totalSeconds = (bot.uptime / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  msg.channel.send(new MessageEmbed()
                   .setDescription(`\`\`\`asciidoc\n
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${hours}:${minutes}:${seconds}
• Users      :: ${bot.users.cache.size.toLocaleString()}
• Servers    :: ${bot.guilds.cache.size.toLocaleString()}
• Channels   :: ${bot.channels.cache.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}\`\`\``)
                   .setColor("RANDOM")
                   //.addField("Invite Me", "If you want to add me to your guild, you can do so by grabbing my invite code from [here](https://discordapp.com/oauth2/authorize/?permissions=268755008&scope=bot&client_id=396323622953680910)")
                   //.addField("Okami Academy", "If you need help setting me up, you can join the [Okami Academy](https://discord.gg/RasxyYT) to get help with getting me ready on your guild!")
                   );
};