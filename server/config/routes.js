module.exports = function (client) {
    const config = require("./config.json");

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
                    message.channel.send(data.quotes[Math.floor(Math.random() * data.quotes.length)] + "    **-" + data.name + "**", { files: [data.image] });
                })
            });
    
            req.on('error', function (e) {
                console.log('ERROR: ' + e.message);
            });
        }
        if (message.content.startsWith(config.prefix + "search")) {
            // The modules we are using are cheerio, snekfetch, and querystring.
            const cheerio = require('cheerio'),
                snekfetch = require('snekfetch'),
                querystring = require('querystring');
    
            let msg = message.content.substring(8);
            // Depending on your command framework (or if you use one), it doesn't have to
            // edit messages so you can rework it to fit your needs. Again, this doesn't have
            // to be async if you don't care about message editing.
            // These are our two variables. One of them creates a message while we preform a search,
            // the other generates a URL for our crawler.
            let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(msg)}`;
            message.channel.send('Searching... Sec.').then((searchMsg) => {
                // We will now use snekfetch to crawl Google.com. Snekfetch uses promises so we will
                // utilize that for our try/catch block.
                snekfetch.get(searchUrl).then((result) => {
    
                    // Cheerio lets us parse the HTML on our google result to grab the URL.
                    let $ = cheerio.load(result.text);
                  
                    console.log(result.text);
    
                    // This is allowing us to grab the URL from within the instance of the page (HTML)
                    let googleData = $('div.jfp3ef > a').first().attr('href');
                  
    
                    // Now that we have our data from Google, we can send it to the channel.
                    googleData = querystring.parse(googleData.replace('/url?', ''));
                    searchMsg.edit(`Result found!\n${googleData.q}`);
    
                    // If no results are found, we catch it and return 'No results are found!'
                }).catch((err) => {
                    searchMsg.edit('No results found!');
                    console.log(err);
                    return err;
                });
            });
        }
    });
}