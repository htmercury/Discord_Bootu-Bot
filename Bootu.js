const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));

client.login(config.token);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

  // Exit and stop if prefix is not there or triggered by another bot
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  // if points don't exist init to 0
  if(!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };
  let userData = points[message.author.id];
  userData.points ++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    // level up!
    userData.level = curLevel;
    message.reply(`Congratulations! You"ve leveled up to level **${curLevel}**!`);
  }

  if (message.content.startsWith(config.prefix + "level")) {
    message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`);
  }

  // Save the edited file
  fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err);
  });

  if (message.content.startsWith(config.prefix + "ping")) {
    message.channel.send("pong!");
  }

  if (message.content.startsWith(config.prefix + "slap")) {
    message.channel.send("this booty");
  }
});
