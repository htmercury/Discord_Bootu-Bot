// discord.js bot
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
    console.log("I am ready!");
    client.user.setGame('Alan is booty');
});
client.login(process.env.TOKEN);

// Web app (Express + EJS)
const http = require('http');
const express = require('express');
const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
    // ejs render automatically looks in the views folder
    response.render('index');
});

app.listen(port, () => {
    // will echo 'Our app is running on http://localhost:5000 when run locally'
    console.log('Our app is running on http://localhost:' + port);
});

// pings server every 3 hrs to prevent dynos from sleeping
setInterval(() => {
    http.get('http://bootu-bot.herokuapp.com');
}, 4800000);

client.on("message", (message) => {

    // Exit and stop if prefix is not there or triggered by another bot
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    if (message.content.startsWith(config.prefix + "ping")) {
        message.channel.send("pong!");
    }

    if (message.content.startsWith(config.prefix + "slap")) {
        message.channel.send("this booty");
    }
    if (message.content.startsWith(config.prefix + "quote")) {
        var https = require('https');
        var options = {
            host: 'okrammus.herokuapp.com',
            path: '/random'
        };

        var req = https.get(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function (chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function () {
                var body = Buffer.concat(bodyChunks);
                var data = JSON.parse(body);
                // ...and/or process the entire body here.
                console.log(data);
                console.log(data.quotes);
                message.channel.send(data.quotes[Math.floor(Math.random() * data.quotes.length)] + "    **-" + data.name + "**");
            })
        });

        req.on('error', function (e) {
            console.log('ERROR: ' + e.message);
        });
    }

});