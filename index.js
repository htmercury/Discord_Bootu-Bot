// init project
var express = require('express');
var app = express();

// ping itself every 5 minutes
const http = require('http');
app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});

app.listen(process.env.PORT );

setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const client = require("./server/config/discordClient")();

require("./server/config/routes")(client);

const Snoowrap = require("snoowrap");
const snoostorm = require("snoostorm");

const creds = {
    userAgent: 'MAIN',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
}

const cc = new Snoowrap(creds);

// Options object is a Snoowrap Listing object, but with subreddit and pollTime options

let hist = {};

const submissions = new snoostorm.SubmissionStream(cc, { subreddit: "buildapcsales", limit: 10, pollTime: 2000 });
submissions.on("item", (entry) => {
    if (hist[entry.permalink] != undefined) {
        return;
    }
    else if (Object.keys(hist).length == 10) {
        // remove the object with the lowest time stamp
        let minKey = Object.keys(hist).reduce(function (a, b) { return hist[a] < hist[b] ? a : b });
        delete hist[minKey];
    }
    hist[entry.permalink] = entry.created_utc;
    var d = new Date(0);
    d.setUTCSeconds(entry.created_utc);
    let time = Math.round((((new Date).getTime() / 1000) - entry.created_utc) / 36) / 100;
    let posted = `this post was posted ${time} hours ago!`
    if (time == 0) {
        time = Math.round((((new Date).getTime() / 1000) - entry.created_utc) / 0.6) / 100;
        posted = `this post was posted ${time} minutes ago!`
    }
    let message = {
        "embed": {
            "title": entry.title,
            "description": `[${entry.num_comments} comments, ${entry.ups} upvotes, ${entry.num_crossposts} crossposts](https://www.reddit.com${entry.permalink})`,
            "url": entry.url,
            "color": 11356838,
            "timestamp": d,
            "footer": {
                "icon_url": "https://cdn.discordapp.com/avatars/129809536923074560/181e61ee119649aceb3ec659f6f9b3b7.png",
                "text": "~villager booty"
            },
            "thumbnail": {
                "url": "https://www.redditstatic.com/avatars/avatar_default_15_545452.png"
            },
            "image": {
                "url": "https://cdn.discordapp.com/avatars/334203611854798849/e6498e8473953a6f0d341a9db7c72148.png"
            },
            "author": {
                "name": entry.author.name,
                "url": `https://www.reddit.com/user/${entry.author.name}`,
                "icon_url": "https://www.redditstatic.com/avatars/avatar_default_15_545452.png"
            },
            "fields": [
                {
                    "name": "🤔",
                    "value": `the product is sold at [${entry.domain}](https://${entry.domain})...`
                },
                {
                    "name": "😱",
                    "value": posted
                },
                {
                    "name": "🙄",
                    "value": `ded bootu is always DEAD;\n Tag(s): **${entry.link_flair_text}**`
                },
                {
                    "name": "<:pat:499744132294770689>",
                    "value": "alan is",
                    "inline": true
                },
                {
                    "name": "<:pat:499744132294770689>",
                    "value": "BIG BOOTY",
                    "inline": true
                }
            ]
        }
    };
    console.log(d.getTime(), entry);
    client.channels.get("589710189557448735").send(message);
});