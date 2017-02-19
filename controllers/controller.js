var express = require("express");
var router = express.Router();
// var db = require("./models");
var bodyParser = require("body-parser");
// var methodOverride = require("method-override");
// var app = express();
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");

mongoose.connect("mongodb://localhost/newsScraper");
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('We are connected!');
});

module.exports = router;
