var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({

    title: { type: String, unique: true },
    link: { type: String, unique: true },
    image: { type: String, unique: true },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
