module.exports = function () {
    // discord.js bot
    const Discord = require("discord.js");
    const client = new Discord.Client();
    client.on("ready", () => {
        console.log("I am ready!");
        client.user.setActivity("Alan is booty");
    });

    client.login(process.env.TOKEN);

    return client;
}