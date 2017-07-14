const Discord = require("discord.js");
const client = new Discord.Client();

client.login("SuperSecretBotTokenHere");

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  // Set the prefix
  let prefix = "~";

  // Exit and stop if prefix is not there or triggered by another bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(prefix + "ping")) {
    message.channel.send("pong!");
  }

  if (message.content.startsWith(prefix + "slap")) {
    message.channel.send("this booty");
  }
});
