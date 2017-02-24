var express = require("express");
var router = express.Router();
var Article = require("../models/article.js");
var Comment = require("../models/comment.js");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var request = require("request");

// Use native promises
mongoose.Promise = global.Promise;
// assert.equal(query.exec().constructor, global.Promise);
// Use bluebird
// mongoose.Promise = require('bluebird');
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

    // Make a request for the huffington post cute-animal page
    request("http://www.huffingtonpost.com/news/cute-animals/", function(error, response, html) {
        // Load the html body from request into cheerio

        var $ = cheerio.load(html);
        var result = [];
        // For each div with a class of ".entry.no_border"
        $("div.entry.no_border").each(function(i, element) {

            //Save the following elements
            var title = $(this).children("h3").children("a").text();
            var link = $(this).find("a").attr("href");
            var image = $(this).find("img").attr("longdesc");

            // If this title element had both a title and a link
            if (title && link && image) {
                //push the elements as an object into the result array
                result.push({
                    title: title,
                    link: link,
                    image: image
                })
            }

        });

        res.render("index", { articles: result });
    });

});

//allows the user to save scraped articles into the db
router.post("/", function(req, res) {

    var art = new Article({
        title: req.body.title,
        link: req.body.link,
        image: req.body.image
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
    //this brings the user back to the
    //scraped results (not empty index route) so they can browse and save more
    res.redirect("/scraped");
})

//this route is called by app.js. Grabs all comments in the array for the specified article
router.get('/populated/:id', function(req, res) {

    Article.find({ '_id': req.params.id })

    .populate('comment')

    .exec(function(err, result) {

        if (err) {
            console.log(err);
        } else {
            console.log('comment saved');
            // res.render("saved", { articles: result });
            res.json(result);
            // res.redirect('/');
        }
    });

});

// add comment and push to specified article...
router.post('/articles/:id', function(req, res) {
    // create a new comment and pass the req.body to the entry.
    var comment = new Comment({
        username: req.body.username,
        body: req.body.body
    });


    comment.save(function(err, result) {
        // log any errors
        if (err) {
            console.log(err);
        } else {
            //updates the article's comments array so that the new comment is included in results
            Article.findOneAndUpdate({ '_id': req.body.id }, { $push: { 'comment': result._id } }, { new: true }, function(err, result) {
                // log any errors
                if (err) {
                    console.log(err);
                } else {
                    //takes you back to saved results
                    res.redirect('/saved');
                }
            });
        }
    });
});

//Delete route for articles
router.post("/articles/one/:id", function(req, res) {
    console.log('I am in delete');
    Article.findOneAndRemove({ "_id": req.params.id }, { $push: { 'comment': Comment._id } }, function(err) {
        if (err) return handleError(err);
        // removed!
    });
    res.redirect('/');
    console.log('removed');

});

//Delete route for comments
router.post("/comments/one/:id", function(req, res) {
    console.log('I am in delete comments!');
    Comment.findOneAndRemove({ "_id": req.params.id }, function(err, comment) {
        // push remove to other linked collections
        // push to Article
        // Article.update({ 'comment': req.params.id }, { $push: { 'comment': req.params.id } }, function(err, numberAffected, raw) {
        //         console.log("Article Model number Affected", numberAffected)
        //     })

        // Article.comment.pull(req.params.id);
        // Article.save(function(err) {
        //     // embedded comment with id `my_id` removed!
        //     console.log('Just removed comment with id of ' + req.params.id);
        // });
        // push to user
        // User.update({ _id: comment._creator }, { $push: { comments: commentId } }, function(err, numberAffected, raw) {
        //     console.log("User model numberAffected", numberAffected)

        // })
    });
    res.redirect('/');
    console.log('comment removed');
});

// Comment.remove({ "_id": req.params.id }, function(err) {
//     if (err) return handleError(err);
//     //removed
// })




module.exports = router;
