var express = require("express");
var router = express.Router();
var Article = require("../models/article.js");
// var Comments = require("../models/article.js");
var Comment = require("../models/comment.js");
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

router.get("/", function(req, res) {
    res.render("index");
})

// Saved articles
router.get("/saved", function(req, res) {
    var query = Article.find({});

    query.exec(function(err, articles) {
        if (err) {
            return handleError(err);
        } else {
            // res.json(articles);
            res.render("saved", { articles: articles });
        }
    });
});

router.get("/comments", function(req, res) {
    var query = Comment.find({});

    query.exec(function(err, comments) {
        if (err) {
            return handleError(err);

        } else {
            res.render('saved', { comments: comments });
        }
    })
})

router.get("/comments/:id", function(req, res) {

    Comment.findOne({ '_id': req.params.id })

    .exec(function(err, comment) {

        if (err) {
            console.log(err);
        } else {

            res.json(comment);

        }
    });
})

// Scrape data from one site and place it into the mongodb db
router.get("/scraped", function(req, res) {

    // Make a request for the aww section of reddit
    request("https://www.reddit.com/r/aww/", function(error, response, html) {
        // Load the html body from request into cheerio

        var $ = cheerio.load(html);
        var result = [];
        // For each element with a "title" class
        $("p.title").each(function(i, element) {

            // Save the text of each link enclosed in the current element
            var title = $(this).text().replace(/ *\([^)]*\) */g, "");

            // Save the href value of each link enclosed in the current element

            // if link starts with /r, it's an internal reddit link...
            //add "https://www.reddit.com" to make it work in my site!
            var link;
            var preLink = "https://www.reddit.com";

            var linkCheck = $(element).children().attr("href");

            if (linkCheck.charAt(0) === "/") {

                link = preLink + linkCheck;
            } else {
                link = linkCheck;
            }

            var image = $(element).children().attr("data-href-url");
            // replace(/^https?\:\/\//i, "")
            // replace(/^http:\/\//i, 'https://')


            // If this title element had both a title and a link
            if (title && link) {

                result.push({
                    title: title,
                    link: link,
                    image: image
                })
            }

        });
        console.log("you have " + result.length + " results");

        res.render("index", { articles: result });
    });

});

router.post("/", function(req, res) {


    var art = new Article({
        title: req.body.title,
        link: req.body.link
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
    res.redirect("/scraped");
})

router.get('/articles/:id', function(req, res) {

    Article.findOne({ '_id': req.params.id })

    .populate('comment')

    .exec(function(err, result) {

        if (err) {
            console.log(err);
        } else {
            console.log('comment saved');
            // res.render("saved", { articles: result });
            res.redirect('/');
        }
    });

});

// add or replace comment and save to db
router.post('/articles/:id', function(req, res) {
    // create a new comment and pass the req.body to the entry.
    var comment = new Comment({
        title: req.body.title,
        body: req.body.body
    });


    comment.save(function(err, result) {
        // log any errors
        if (err) {
            console.log(err);
        } else {

            Article.findOneAndUpdate({ '_id': req.body.id }, { 'comment': result._id })
                // execute the above query
                .exec(function(err, result) {
                    // log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        // or send the document to the browser
                        // res.render("saved", { articles: result });
                        console.log(result);
                        res.redirect('/saved');
                    }
                });
        }
    });
});





module.exports = router;
