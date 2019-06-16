// init project
var express = require('express');
var app = express();

// ping itself every 5 minutes
const http = require('http');
app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});

app.listen(process.env.PORT);

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

const submissions = new snoostorm.SubmissionStream(cc, { subreddit: "buildapcsales", limit: 10, pollTime: 2000 });
submissions.on("item", (entry) => {
    var d = new Date(0);
    d.setUTCSeconds(entry.created_utc);
    let message = `
    \`\`\`diff
    \nTitle:[${entry.title}](${entry.url})\n 
    \n+Comments: https://reddit.com${entry.permalink}\n
    \n-Created on ${d} which is ${Math.round((((new Date).getTime()/1000) - entry.created_utc) / 36) / 100} hours ago
    \`\`\`
    `;
    client.channels.get("589710189557448735").send(message);
});