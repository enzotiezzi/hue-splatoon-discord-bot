var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

var bot = new Discord.Client();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});


bot.on('message', function (message) {
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);

        switch (message.channel.name) {
            case 'check-in-treino':
                handleTreino(cmd, message);
                break;
        }
    }
});

function handleTreino(cmd, message) {
    var userName = message.author.username + '#' + message.author.discriminator;
    switch (cmd) {
        case 'ping':
            message.reply("funcionou caralho");
            console.log(message.author.discriminator);
            console.log(message.author.username);

            console.log(message.channel.name);
            break;
        case 'treino':
            if (treino.indexOf(userName) == -1) {
                treino.push(userName);
                message.reply("se inscreveu para o treino");
                console.log(treino);
            }
            else {
                message.reply("já está na lista de treino");
            }
            break;
        case 'listar':
            var lista = "";
            for (var i = 0; i < treino.length; i++)
                lista += treino[i] + "\n";

            if (lista.length == 0)
                lista = "não tem jogadores na lista de treino";

            message.channel.send(lista);
            break;
        case 'sair':
            const index = treino.indexOf(userName);
            if (index != -1) {
                treino.splice(index, 1);
                message.reply("saiu da lista de treino");
            }
            else {
                message.reply("já saiu da lista de treino");
            }

            break;
        case 'dm':
            message.author.createDM()
                .then(x => x.send('olá membro da HUE'));
            break;
        case 'limpar':
            treino = [];
            break;
    }
}

bot.login(auth.token);

var treino = [];