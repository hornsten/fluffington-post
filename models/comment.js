var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    username: String,
    body: String

});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
