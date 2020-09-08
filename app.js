const Discord = require("discord.js");
const bot = new Discord.Client({
    autoReconnect: true,
    disableEveryone: true
});
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      http = require('http').Server(app);

bot.login(process.env.TOKEN)
// ------------- Express ---------------------------

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.status(200).render('index', {
    bot: bot
  });
});

app.listen(process.env["PORT"], function(){
  console.log('Listening on: ' + process.env["PORT"]);
});

// ------------- Shard Management ------------------

const shard = new Discord.ShardingManager("./core.js", {
    autoSpawn: true,
    token: process.env.TOKEN,
    totalShards: "auto", // "auto" or number
});

shard.spawn();

shard.on('launch', (shard) => {
  console.log(`⬇ [SHARD] Shard ID #${shard.id} ⬇`);
});