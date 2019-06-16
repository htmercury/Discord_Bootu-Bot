module.exports = function (client) {
    const config = require("./config.json");
    const commands = require("../commands/main");

    client.on("message", (message) => {

        const swearWords = process.env.SWEARWORDS.split(' ');
        if (swearWords.some(word => message.content.toLowerCase().includes(word))) {
    
            message.channel.send("Oh no you said a bad word!!!");
            // Or just do message.delete();
        }
    
        if (Object.keys(config.responseObject).some(word => message.content.toLowerCase().includes(word)))
            message.channel.send(config.responseObject[message.content]);
    
        // Exit and stop if prefix is not there or triggered by another bot
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    
        if (message.content.startsWith(config.prefix + "ping")) {
            message.channel.send("pong!");
        }
    
        if (message.content.startsWith(config.prefix + "slap")) {
            message.channel.send("this booty");
        }
        if (message.content.startsWith(config.prefix + "quote")) {
            commands.quote(message);
        }
        if (message.content.startsWith(config.prefix + "search")) {
            commands.search(message);
        }
    });
}