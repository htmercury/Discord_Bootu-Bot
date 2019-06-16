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