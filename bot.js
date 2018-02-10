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
            case 'lfg':
                handleLFG(cmd, message);
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
        case 'chamar':
            for (var i = 0; i < treino.length; i++) {
                var member = message.channel.members.find(x => (x.user.username + '#' + x.user.discriminator) == treino[i]);

                if (member != null && member != undefined) {
                    member.createDM()
                        .then(x => x.send('Bora treinar'));
                }
            }

            break;
    }
}

function handleLFG(cmd, message) {
    var userId = message.author.id;
    var userName = message.author.username + '#' + message.author.discriminator;

    switch (cmd) {
        case 'twin':
            if (twin.indexOf(userId) != -1)
                message.reply('você já está na lista de TWINS');
            else {
                twin.push(userId);
                message.channel.send('@everyone ' + userName + ' está procurando TWIN');
            }
            break;
        case 'sair':
            var twinIndex = twin.indexOf(userId);
            var quadIndex = quad.indexOf(userId);

            if (twinIndex != -1) {
                twin.splice(twinIndex, 1);
                message.reply('você saiu das lista de twin');
            }
            else message.reply('você já saiu da lista de twin');
            
            if (quadIndex != -1) {
                quad.splice(quadIndex, 1);
                message.reply('você saiu das lista de quad');
            }
            else message.reply('você já saiu da lista de quad');

            break;
        case 'quad':
            if (quad.indexOf(userId) != -1)
                message.reply('você já está na lista de QUADS');
            else {
                quad.push(userId);

                var qtd = Math.abs(quad.length - 4);

                if (qtd <= 0) {
                    for (var i = 0; i < quad.length; i++) {
                        var member = message.channel.members.find(x => x.user.id == quad[i]);

                        if (member != null && member != undefined) {
                            message.channel.send(member.user.toString());
                            member.createDM()
                                .then(x => x.send('Tem quad pra jogar'));
                        }
                    }
                }
                else {
                    message.channel.send('@everyone +' + qtd);
                }
            }
            break;
    }
}

bot.login(auth.token);

var treino = [];
var twin = [];
var quad = [];