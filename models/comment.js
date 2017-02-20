var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    // _id: ObjectId(...),
    // discussion_id: ObjectId(...),
    // slug: '34db',
    // posted: ISODateTime(...),
    // author: {
    //     id: ObjectId(...),
    //     name: 'Rick'
    // },
    title: { type: String, unique: true },
    text: { type: String, unique: true }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
