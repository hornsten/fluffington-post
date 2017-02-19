var express = require("express");
var router = express.Router();
var Article = require("../models/article.js");
var bodyParser = require("body-parser");
// var methodOverride = require("method-override");
// var app = express();
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");
// Use bluebird
mongoose.Promise = require('bluebird');
// assert.equal(query.exec().constructor, require('bluebird'));

mongoose.connect("mongodb://localhost/newsScraper");
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('We are connected!');
});

// Main route (simple Hello World Message)
router.get("/", function(req, res) {
    res.send("Hello world!");
});

router.get("/all", function(req, res) {
    var query = Article.find({});

    query.exec(function(err, articles) {
        if (err) {
            return handleError(err);
        } else {
            res.json(articles);
        }
    });
});

// Scrape data from one site and place it into the mongodb db
router.get("/scrape", function(req, res) {
    // Make a request for the news section of ycombinator
    request("https://www.reddit.com/r/aww/", function(error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);
        // For each element with a "title" class
        $("p.title").each(function(i, element) {
            // Save the text of each link enclosed in the current element
            var title = $(this).text();
            // Save the href value of each link enclosed in the current element
            var link = $(element).children().attr("href");

            // If this title element had both a title and a link
            if (title && link) {
                // Save the data in the scrapedData db

                var art = new Article({
                    title: title,
                    link: link
                });

                art.save(function(err, art) {
                    // If there's an error during this query
                    if (err) {
                        // Log the error
                        return console.log(err);
                    }
                    // Otherwise,
                    else {
                        // Log the saved data
                        console.log(art);
                    }
                });
            }
        });
    });

    // This will send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});


module.exports = router;
