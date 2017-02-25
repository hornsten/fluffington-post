var express = require("express");
// var db = require("./models");
var bodyParser = require("body-parser");
var app = express();
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");
var PORT = process.env.PORT || 3000;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + "/public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Require Handlebars
var exphbs = require("express-handlebars");
var Handlebars = require("handlebars");

//This is a custom helper. I used it to group my thumbnails 3 to a row
Handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "",
        subcontext = [],
        i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

//Select and set Handlebars as the engine and "main" as the default layout
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Imports the routes from controller
var routes = require('./controllers/controller.js');
app.use('/', routes);


app.listen(PORT, function() {
    console.log("Listening on port %s", PORT);
});
