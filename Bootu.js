const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

  // Exit and stop if prefix is not there or triggered by another bot
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  if (message.content.startsWith(config.prefix + "ping")) {
    message.channel.send("pong!");
  }

  if (message.content.startsWith(config.prefix + "slap")) {
    message.channel.send("this booty");
  }
});
