var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({

    title: { type: String, unique: true },
    link: { type: String, unique: true }
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
