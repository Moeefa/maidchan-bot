
const config = {
  tictactoe: {}
}
const { MessageEmbed } = require('discord.js');

var donot = false;

exports.run = async (client, message, args) => {
    client.embed = (channel, message, timer) => {
      channel = channel.channel || channel;
    
      channel.send(message).then(msg => {
        if (!isNaN(timer)) msg.delete(timer);
      });
    }
  
    if (args[0] == "start" || args[0] == "iniciar") {
      if (!message.mentions.users.first()) return client.embed(message.channel, "Por favor indique alguém para jogar com você.");
      if (config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`]) return client.embed(message.channel, "Você não pode iniciar um jogo sem parar o outro.");
      
      config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`] = {
        guild: message.guild.id,
        playerTurn: message.author.id,
        player1: message.author.id,
        player2: message.mentions.users.first().id,
        playersArray: [message.author.id, message.mentions.users.first().id],
        gameDisplay: '1⃣ 2⃣ 3⃣\n4⃣ 5⃣ 6⃣\n7⃣ 8⃣ 9⃣'
      };
      
      let embed = new MessageEmbed()
      .setTitle("O jogo começou!")
      .setDescription(config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].gameDisplay)
      .setColor('#8342F4')
      .setTimestamp()
      .setFooter(`Vez de: ${client.users.cache.get(config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).tag}`, client.users.cache.get(config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).avatarURL())
      message.channel.send(`${message.author} ${message.mentions.users.first()}`, embed).then(msg => {        
        msg.react('1⃣').then(() => msg.react('2⃣').then(() => msg.react('3⃣').then(() => msg.react('4⃣').then(() => msg.react('5⃣').then(() => msg.react('6⃣').then(() => msg.react('7⃣').then(() => msg.react('8⃣').then(() => msg.react('9⃣')))))))));
        
        const one = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '1⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        const two = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '2⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        const three = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '3⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        
        const four = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '4⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        const five = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '5⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        const six = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '6⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        
        const seven = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '7⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        const eight = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '8⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        const nine = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '9⃣' && user.id === config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).on('collect', r => reacted(r));
        
        function reacted(r) {
          var testWinner1 = config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].gameDisplay.replace('1⃣', 'x').replace('2⃣', 'x').replace('3⃣', 'x').replace('4⃣', 'x').replace('5⃣', 'x').replace('6⃣', 'x').replace('7⃣', 'x').replace('8⃣', 'x').replace('9⃣', 'x').replace(/⭕/g, 'x').replace(/❌/g, 'o')
          var testWinner2 = config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].gameDisplay.replace('1⃣', 'x').replace('2⃣', 'x').replace('3⃣', 'x').replace('4⃣', 'x').replace('5⃣', 'x').replace('6⃣', 'x').replace('7⃣', 'x').replace('8⃣', 'x').replace('9⃣', 'x').replace(/❌/g, 'x').replace(/⭕/g, 'o')
          
          config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].gameDisplay = config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].gameDisplay.replace(r.emoji.name, (config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn == config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].player1) ? '❌' : '⭕')
          embed.setDescription(config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].gameDisplay)
          
          if (checkWinner() == 1 || checkWinner() == 2) {
            embed.setFooter(`${client.users.cache.get(config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).tag} ganhou a partida! 🎉`, client.users.cache.get(config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).avatarURL())
            one.stop(), two.stop(), three.stop(), four.stop(), five.stop(), six.stop(), seven.stop(), eight.stop(), nine.stop();
            delete config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`];
          } else if (checkWinner() == -1) {
            config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn = (config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn == config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].player1) ? config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn = config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].player2 : config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn = config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].player1
            embed.setFooter(`Vez de: ${client.users.cache.get(config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).tag}`, client.users.cache.get(config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playerTurn).avatarURL())
          } else if (checkWinner() == 0) {
            embed.setFooter(`Deu velha!`)
            one.stop(), two.stop(), three.stop(), four.stop(), five.stop(), six.stop(), seven.stop(), eight.stop(), nine.stop();
            delete config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`];
          }
          
          embed.setTimestamp();
          
          msg.edit(`${message.author} ${message.mentions.users.first()}`, embed);
        };
        
        function checkWinner() {
          var board = config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].gameDisplay
          .replace(/1⃣/g, '0')
          .replace(/2⃣/g, '0')
          .replace(/3⃣/g, '0')
          .replace(/4⃣/g, '0')
          .replace(/5⃣/g, '0')
          .replace(/6⃣/g, '0')
          .replace(/7⃣/g, '0')
          .replace(/8⃣/g, '0')
          .replace(/9⃣/g, '0')
          .replace(/❌/g, '1')
          .replace(/⭕/g, '2')
          .replace(/\n/g, '-')
          .replace(/\s/g, '');
          if(/222|2...2...2|2....2....2|2..2..2/.test(board)) return 2;
          if(/111|1...1...1|1....1....1|1..1..1/.test(board)) return 1;
          if(/0/.test(board)) return -1;
          return 0;
        };
      });
    };
    
    if (args[0] == "parar" || args[0] == "stop") {
      if (!message.mentions.users.first()) return client.embed(message.channel, "Mencione a pessoa que você deseja terminar a partida.")
      if (!config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`]) return client.embed(message.channel, "Não há um jogo iniciado. para começar digite `c!tictactoe start`.")
      if (!config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`].playersArray.includes(message.author.id)) return client.embed(message.channel, "Você não pode parar um jogo de outras pessoas!")
      delete config.tictactoe[`${message.author.id}-${message.mentions.users.first().id}`];
      client.embed(message.channel, "Jogo parado com sucesso.")
      return;
    };
};

exports.conf = {
  aliases: ['ttt']
};

exports.help = {
  description: "Play Tic-Tac-Toe with someone!",
  usage: "tictactoe <start|stop>"
}