const Discord = require("discord.js");
const fs = require("fs");
const klaw = require("klaw");
const path = require("path");
const config = require("./config.json");

const Level = require("./schemas/level.js");
const Global = require("./schemas/globalRank.js");
const Guild = require("./schemas/guilds.js");
const User = require("./schemas/users.js");

const bot = new Discord.Client({
  autoReconnect: true
});

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
// -------------------- Config -------------------------

require("./modules/functions.js")();
bot.lang = require("./langs/pt-BR.js");
bot.config = config;
bot.categories = new Discord.Collection();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.updatePresence = function updatePresence() {
  var act = [
    ["Eu ainda estou em testes!", "PLAYING"],
    [
      `${bot.users.cache.size} usuários em ${bot.guilds.cache.size} servidores!`,
      "WATCHING"
    ],
    ["Fiquem em casa!", "PLAYING"]
  ];
  var rnd = act[Math.floor(Math.random() * act.length)];
  bot.user.setActivity(bot.config.prefix + "help | " + rnd[0], {
    type: rnd[1]
  });
};

// -------------------- Load commands --------------------

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    bot.on(eventName, event.bind(null, bot));
  });
});

klaw("./commands/").on("data", item => {
  const cmdFile = path.parse(item.path);
  if (!cmdFile.ext || cmdFile.ext !== ".js") return;
  let commandName = cmdFile.name.split(".")[0];
  const response = _loadCommand(cmdFile.dir, `${commandName}`);
  if (response) console.log(response);
});

bot.login(process.env.TOKEN);

function _loadCommand(commandPath, commandName) {
  try {
    console.log(`Loading Command: ${commandName}`);
    const props = require(`${commandPath}${path.sep}${commandName}`);
    if (props.init) {
      props.init(bot);
    }

    !props.help
      ? (props.help = {
          category: commandPath.slice(
            commandPath.lastIndexOf("/") + 1,
            commandPath.length
          ),
          name: commandName
        })
      : (props.help.category = commandPath.slice(
          commandPath.lastIndexOf("/") + 1,
          commandPath.length
        )),
      (props.help.name = commandName);
    !props.conf
      ? (props.conf = {
          guildOnly: true
        })
      : !props.conf.guildOnly
      ? (props.conf.guildOnly = true)
      : void 0;

    bot.categories.set(
      commandPath.slice(commandPath.lastIndexOf("/") + 1, commandPath.length),
      commandPath.slice(commandPath.lastIndexOf("/") + 1, commandPath.length)
    );
    bot.commands.set(commandName, props);
    props.conf && props.conf.aliases
      ? props.conf.aliases.forEach(alias => {
          bot.aliases.set(alias, props.help.name);
        })
      : void 0;

    return false;
  } catch (e) {
    bot.users.cache
      .get("492874648141168660")
      .send(
        new Discord.MessageEmbed()
          .setColor(bot.config.primaryColor)
          .setDescription(
            "Não consigo rodar esse comando!\nVocê pode mandar esse erro para o meu criador:\n```" +
              e.message +
              "```"
          )
      );
    return `Unable to load command ${commandName}: ${e}`;
  }
}

// --------------------- Mention bot
let cache = "";
bot.on("message", msg => {
  const args = msg.content
    .slice()
    .trim()
    .split(/ +/g);
  //if (args.length == 1) console.log(msg.content)
  if (
    (args[0] == "<@" + bot.user.id + ">" ||
      args[0] == "<@!" + bot.user.id + ">") &&
    args.length === 1
  ) {
    msg.channel.send(
      `Olá, ${msg.author}! Para ver os meus comandos use: \`m.help\`.`
    );
  } else if (
    (args[0] == "<@" + bot.user.id + ">" ||
      args[0] == "<@!" + bot.user.id + ">") &&
    args.length > 1
  ) {
    const dialogflow = require("dialogflow");

    const uuid = require("uuid");

    async function runSample(projectId = "discordbot-a789d") {
      // A unique identifier for the given session

      const sessionId = uuid.v4(); // Create a new session

      const sessionClient = new dialogflow.SessionsClient();

      const sessionPath = sessionClient.sessionPath(projectId, msg.author.id); // The text query request.

      const request = {
        session: sessionPath,

        queryInput: {
          text: {
            // The query to send to the dialogflow agent

            text: args.slice(1).join(" "), // The language used by the client (en-US)

            languageCode: "pt-BR"
          }
        }
      }; // Send request and log result

      const responses = await sessionClient.detectIntent(request);

      console.log("Detected intent");

      const result = responses[0].queryResult;

      console.log(`  Query: ${result.queryText}`);

      console.log(`  Response: ${result.fulfillmentText}`);

      if (result.intent) {
        if (
          result.intent.displayName.includes("Owner |") &&
          msg.author.id !== bot.config.ownerID
        )
          return;
        //if (result.intent.displayName == "Creator contact - yes") bot.users.cache.get(bot.config.ownerID).send(`${msg.author.tag} deseja contatá-lo!`), cache = msg.author.id;
        //if (result.intent.displayName == "Owner | Contact DND") bot.users.cache.get(cache).send("Ele me disse que ele está ocupado no momento!");

        msg.author.id == bot.config.ownerID &&
        result.intent.displayName == "I love you!"
          ? msg.channel.send("Eu te amo também!")
          : msg.channel.send(
              result.fulfillmentText.replace("<author>", msg.author)
            );
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log(`  No intent matched.`);
      }
    }
    //runSample();
    const cleverbot = require("cleverbot-free");

    // Without context

    cleverbot(args.slice(1).join(" ")).then(response =>
      msg.channel.send(response)
    );
  }
});

// --------------------- Level/xp system ----------------------

bot.on("message", async message => {
  User.findOne({ userID: message.author.id }, (err, register) => {
    if (!register) return;
    if (message.author.bot) return;
    if (message.channel.type !== "text") return;
    let xptoadd = Math.ceil(Math.random() * 65) + 8;
    Level.findOne(
      { userID: message.author.id, guildID: message.guild.id },
      (err, level) => {
        if (!level) {
          const newLevel = new Level({
            userID: message.author.id,
            userTag: message.author.tag,
            guildID: message.guild.id,
            level: 1,
            xp: xptoadd
          });
          newLevel.save().catch();
        } else {
          level.xp = level.xp + xptoadd;
          level.save().catch();
          Level.findOne(
            { userID: message.author.id, guildID: message.guild.id },
            (err, leveln) => {
              let nxtLvl = leveln.level * 265;
              if (leveln.xp >= nxtLvl) {
                User.findOne({ userID: message.author.id }, (err, userdb) => {
                  if (!userdb || !userdb.money) {
                    const newMoney = new User({
                      userID: message.author.id,
                      money: 5
                    });
                    newMoney.save().catch();
                  } else {
                    userdb.money = userdb.money + 5;
                    userdb.save().catch();
                  }
                });
                leveln.level = leveln.level + 1;
                leveln.xp = 0;
                leveln.save().catch();
                Guild.findOne(
                  { guildID: message.guild.id },
                  async (err, guild) => {
                    if (!guild) return;
                    if (
                      guild.levelroles &&
                      guild.levelroles.some(
                        a => Number(a.level) >= Number(leveln.level)
                      )
                    ) {
                      var rolelevel = guild.levelroles.find(
                        a => Number(a.level) >= Number(leveln.level)
                      ).role;
                      if (!message.member.roles.find(r => r.id === rolelevel)) {
                        try {
                          message.member.addRole(
                            message.guild.roles.get(rolelevel)
                          );
                        } catch (err) {
                          return;
                        }
                      }
                    }
                    if (guild.levelMsg && guild.levelMsg === true) {
                      const embed = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.tag}`)
                        .setThumbnail(message.author.avatarURL)
                        .setDescription("Você upou!")
                        .setColor("RANDOM");
                      message.channel.send(embed).then(msg => {
                        if (guild.levelDelete) {
                          setTimeout(() => {
                            msg.delete();
                          }, 30000);
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
});

bot.on("message", async message => {
  User.findOne({ userID: message.author.id }, (err, register) => {
    if (!register) return;
    if (message.author.bot) return;
    if (message.channel.type !== "text") return;
    let xptoadd = Math.ceil(Math.random() * 32) + 8;
    Global.findOne({ userID: message.author.id }, (err, level) => {
      if (!level) {
        const newGLevel = new Global({
          userID: message.author.id,
          userTag: message.author.tag,
          guildID: message.guild.id,
          level: 1,
          xp: xptoadd
        });
        newGLevel.save().catch();
      } else {
        level.xp = level.xp + xptoadd;
        level.save().catch();
        Global.findOne({ userID: message.author.id }, (err, leveln) => {
          let nxtLvl = leveln.level * 925;
          if (leveln.xp >= nxtLvl) {
            User.findOne({ userID: message.author.id }, (err, userdb) => {
              if (!userdb || !userdb.money) {
                const newMoney = new User({
                  userID: message.author.id,
                  money: 15
                });
                newMoney.save().catch();
              } else {
                userdb.money = userdb.money + 15;
                userdb.save().catch();
              }
            });
            leveln.level = leveln.level + 1;
            leveln.xp = 0;
            leveln.save().catch();
          }
        });
      }
    });
  });
});

// -------------- Lovely's Bakery exclusive
bot.on("ready", function() {
  const fetch = require("node-fetch");
  function getHentai() {
    Guild.findOne({ guildID: "387352984306188289" }, (err, guild) => {
      if (!guild.hentaitimer)
        (guild.hentaitimer = Date.now() + 14400000), guild.save();
      // console.log(guild.hentaitimer)
      if (Date.now() > guild.hentaitimer) {
        guild.hentaitimer = Date.now() + 14400000;
        guild.save();
        fetch(
          `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${"1girl"}&limit=90000000000`
        )
          .then(res => res.json())
          .then(json => {
            json = json.filter(
              e =>
                !e.tags.includes("loli") ||
                !e.tags.includes("lolita") ||
                !e.tags.includes("lolicon") ||
                !e.tags.includes("furry")
            );
            json[Math.floor(Math.random() * json.length)].file_url;
            //console.log(rand)
            //bot.channels.cache.map(i => { console.log(i.name) })
            //json.forEach(i => console.log(i.tags.includes("loli")))
            bot.channels.cache
              .get("523168218395836460")
              .send(
                `${json[Math.floor(Math.random() * json.length)].file_url}\n\n${json[Math.floor(Math.random() * json.length)].file_url}\n\n${json[Math.floor(Math.random() * json.length)].file_url}`
              );
          });
      }
    });
  }
  getHentai();
  setInterval(() => {
    /*User.findOne({ userID: bot.config.ownerID }, (err, result) => {
      if (bot.users.cache.get(bot.config.ownerID).presence.status == "offline") {
        result.gday = Date.now() + 1.98e+8, result.save();
      } else {
        if (Date.now() > result.gday) {
          bot.users.cache.get(bot.config.ownerID).send("Bom dia! Como você vai?")
          result.gday = Date.now() - 999999999, result.save();
        } else {
          result.gday = Date.now() - 999999999, result.save();
        }
      }
    });*/
    getHentai();
  }, 60000);
});
