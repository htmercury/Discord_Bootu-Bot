module.exports = function (client) {
    const config = require("./config.json");
    const commands = require("../commands/main");

    client.on("message", (message) => {
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
      
        if (message.content.startsWith(config.prefix + "join")) {
            if (!message.member.voiceChannel) {
                message.reply("You must be in a voice channel to summon me!");
                return;
            }
            message.member.voiceChannel.join().then(connection => {
                // Yay, it worked!
                console.log("Successfully connected.");
                let sound = config.sounds[Math.floor(Math.random()*config.sounds.length)];
                let streamOptions = {
                  volume:2,
                  passes:5
                }
                const dispatcher = connection.playArbitraryInput(sound, streamOptions);
                dispatcher.setVolume(1);
                dispatcher.on('end', () => {
                  // The song has finished
                  console.log('done');
                  message.guild.voiceConnection.disconnect();
                });

                dispatcher.on('error', e => {
                  // Catch any errors that may arise
                  console.log(e);
                });
            }).catch(e => {
                // Oh no, it errored! Let's log it to console :)
                console.error(e);
            });
        }
      
        if (message.content.startsWith(config.prefix + "leave")) {
            if (message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }
            else {
                message.reply("I must be in a voice channel to be banished!");
            }
        }

        if (message.content.startsWith(config.prefix + "clearchat")) {
            async function clear() {
                message.delete();
                const fetched = await message.channel.fetchMessages({limit: 99});
                message.channel.bulkDelete(fetched);
            }
            clear();
        }

        if (message.content.startsWith(config.prefix + "quote")) {
            commands.quote(message);
        }
        if (message.content.startsWith(config.prefix + "search")) {
            commands.search(message);
        }
    });
}