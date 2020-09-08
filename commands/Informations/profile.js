const { createCanvas, loadImage, registerFont } = require("canvas");
registerFont("seguiemj.ttf", { family: "segoeuiemoji" });//, registerFont("komorebi-gothic.ttf", { family: "komorebi" });
const canvas = createCanvas(800, 900),
      ctx = canvas.getContext("2d"),
      Discord = require("discord.js"),
      path = require("path"),
      Level = require("../../schemas/level.js"),
      User = require("../../schemas/users.js"),
      Global = require("../../schemas/globalRank.js");

function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

exports.run = async (bot, msg, args) => {
  let d = msg.mentions.users.first() || msg.author;
  var e = "https://i.pinimg.com/originals/68/50/5f/68505f719376ccced63981b220232782.jpg";
  
  await User.findOne({ userID: d.id }, async (a, b) => {
    e = b && b.background ? b.background : "https://i.pinimg.com/originals/68/50/5f/68505f719376ccced63981b220232782.jpg"
  }), msg.channel.startTyping();
  
  let h = d.displayAvatarURL({ format: "png", size: 2048 }),
    i = d.discriminator,
    j = d.username,
    k = {
      online: "https://cdn.discordapp.com/emojis/508643149858734081.png?v=1",
      idle: "https://cdn.discordapp.com/emojis/508643149229457420.png?v=1",
      dnd: "https://cdn.discordapp.com/emojis/508643149183451148.png?v=1",
      offline: "https://cdn.discordapp.com/emojis/508643149405487105.png?v=1"
    }[d.presence.status];
  
  j = 15 < j.length && "347866212442570762" !== d.id && "482161903792291840" !== d.id ? j.slice(0, 15) + "..." : j;
  User.findOne({ userID: d.id }, (f, user) => {
    Level.findOne({ userID: d.id, guildID: msg.guild.id }, (f, level) => {
      Global.findOne({ userID: d.id }, (f, glevel) => {
        loadImage(e).then(async e => {
          if (ctx.drawImage(e, 0, 0), ctx.fillStyle = "#ddd", ctx.strokeStyle = "black", ctx.font = "bold 50px sans-serif, segoeuiemoji", user && user.money ? (ctx.fillText(`Tickets: ${user.money}`, 50, 480), ctx.strokeText(`Tickets: ${user.money}`, 50, 480)) : (ctx.fillText(`Tickets: 0`, 50, 480), ctx.strokeText(`Tickets: 0`, 50, 480)), !level) {
            ctx.fillText(`Server Level: 1`, 50, 550), ctx.strokeText(`Server Level: 1`, 50, 550), ctx.save(), ctx.fillStyle = "#000", roundRect(ctx, 50, 580, 700, 70, {
              tl: 25,
              br: 25
            }, !0), ctx.fillStyle = "#ddd";
            var f = Math.min(Math.max(Math.min(Math.max(parseInt(0), 0), parseInt(265)) / parseInt(265), 0), 1);
            ctx.fillStyle = "#000", ctx.strokeStyle = "#ddd", ctx.font = "50px sans-serif, segoeuiemoji", ctx.fillText("Server XP: 0 / 265", 60, 625), ctx.strokeText("Server XP: 0 / 265", 60, 625), ctx.restore()
          } else {
            ctx.fillText(`Server Level: ${level.level}`, 50, 550), ctx.strokeText(`Server Level: ${level.level}`, 50, 550), ctx.save(), ctx.fillStyle = "#000", roundRect(ctx, 50, 580, 700, 70, {
              tl: 25,
              br: 25
            }, !0), ctx.fillStyle = "#ddd";
            var f = Math.min(Math.max(Math.min(Math.max(parseInt(level.xp), 0), parseInt(level.level * 265)) / parseInt(level.level * 265), 0), 1);
            (level.xp > 0) ? roundRect(ctx, 50, 580, 700 * f, 60, {
              tl: 25,
              br: 25
            }, !0) : (void 0), ctx.fillStyle = "#000", ctx.strokeStyle = "#ddd", ctx.font = "50px sans-serif, segoeuiemoji", ctx.fillText("Server XP: " + abbreviateNumber(level.xp) + " / " + abbreviateNumber(level.level * 265), 60, 625), ctx.strokeText("Server XP: " + abbreviateNumber(level.xp) + " / " + abbreviateNumber(level.level * 265), 60, 625), ctx.restore()
          }
          if (!glevel) {
            ctx.fillText(`Global Level: 1`, 50, 750), ctx.strokeText(`Global Level: 1`, 50, 750), ctx.save(), ctx.fillStyle = "#000", roundRect(ctx, 50, 780, 700, 70, {
              tl: 25,
              br: 25
            }, !0), ctx.fillStyle = "#ddd";
            var f = Math.min(Math.max(Math.min(Math.max(parseInt(0), 0), parseInt(425)) / parseInt(425), 0), 1);
            ctx.fillStyle = "#000", ctx.strokeStyle = "#ddd", ctx.font = "50px sans-serif, segoeuiemoji", ctx.fillText("Global XP: 0 / 925", 60, 825), ctx.strokeText("Global XP: 0 / 925", 60, 825), ctx.restore()
          } else {
            ctx.fillText(`Global Level: ${glevel.level}`, 50, 750), ctx.strokeText(`Global Level: ${glevel.level}`, 50, 750), ctx.save(), ctx.fillStyle = "#000", roundRect(ctx, 50, 780, 700, 70, {
              tl: 25,
              br: 25
            }, !0), ctx.fillStyle = "#ddd";
            var f = Math.min(Math.max(Math.min(Math.max(parseInt(glevel.xp), 0), parseInt(glevel.level * 925)) / parseInt(glevel.level * 925), 0), 1);
            (glevel.xp > 0) ? roundRect(ctx, 50, 780, 700 * f, 60, {
              tl: 25,
              br: 25
            }, !0) : (void 0), ctx.fillStyle = "#000", ctx.strokeStyle = "#ddd", ctx.font = "50px sans-serif, segoeuiemoji", ctx.fillText("Global XP: " + abbreviateNumber(glevel.xp) + " / " + abbreviateNumber(glevel.level * 925), 60, 825), ctx.strokeText("Global XP: " + abbreviateNumber(glevel.xp) + " / " + abbreviateNumber(glevel.level * 925), 60, 825), ctx.restore()
          }
          ctx.fillStyle = "#ddd", roundRect(ctx, 20, 20, 760, 352, {
            tl: 50,
            br: 25
          }, !0), ctx.font = "60px sans-serif, segoeuiemoji", ctx.fillStyle = "#000", ctx.fillText(`${j}`, 55, 350), loadImage(`${h}`).then(async c => {
            ctx.save(), ctx.beginPath(), ctx.arc(158, 154, 124, 0, 2 * Math.PI, !0), ctx.closePath(), ctx.clip(), ctx.drawImage(c, 30, 30, 252, 252), ctx.beginPath(), ctx.arc(0, 0, 25, 0, 2 * Math.PI, !0), ctx.clip(), ctx.closePath(), ctx.restore(), loadImage(`${k}`).then(async c => {
              ctx.drawImage(c, 210, 200, 80, 80);
              const e = new Discord.MessageAttachment(canvas.toBuffer());
              bot.channels.cache.get("455536285902176281").send(e).then(async a => {
                var z = ["Por que você tá vendo o perfil do meu criador?"];
                
                const c = new Discord.MessageEmbed().setDescription("Informa\xE7\xF5es de: `" + d.tag + "`.").setImage(a.attachments.first().url).setColor("RANDOM").setFooter(`Comando requisitado por: ${msg.author.username}.`, `${msg.author.displayAvatarURL()}`);
                //if (d.id === bot.config.ownerID && msg.author.id !== bot.config.ownerID) c.setAuthor(z[Math.floor(Math.random() * z.length)], "https://cdn.discordapp.com/attachments/459198144052330498/690705876105035827/20200320_192909.jpg"), bot.user.setActivity(`o(a) ${msg.author.username} no lixo por stalkear o meu criador!`, { type: "PLAYING" }), setTimeout(() => { bot.updatePresence() }, 20000);
                msg.channel.send(c), msg.channel.stopTyping();
              })
            })
          })
        })
      })
    })
  }).catch(() => {
    msg.channel.send("Algo inesperado aconteceu! Tente novamente ou contate \uD83C\uDF61Moeefa | \u30E2\u30A8\u30A8\u30D5\u30A1\uD83C\uDF59#7082 caso o erro persistir.")
  })
};