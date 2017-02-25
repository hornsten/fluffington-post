$(document).ready(function() {

    var articleId;
    $(".comment-btn").click(function(event) {


        event.preventDefault();

        var currentURL = window.location.origin;
        articleId = $(this).attr('data-button');

        $.get(currentURL + "/populated/" + articleId, function(data) {

            var art = data[0];

            if (art.comment.length) {
                //First comment rendered as html to clear div, so no repeats!
                $('#' + articleId).html('<div class="alert alert-info alert-dismissible" role="alert"><form action="/comments/one/' + art.comment[0]._id + '" method="POST"><input type="hidden" name="id" value="' + art.comment[0]._id + '"><button class="close" type="submit"><span aria-hidden="true">&times;</span></button><h3>' + art.comment[0].body + '<br>' + '<h4>written by ' + art.comment[0].username) + '</h4></div>';
                //loop through remaining comments and append to modal body
                for (var i = 1; i < data[0].comment.length; i++) {

                    // '<form action="/articles/one/{{this._id}}" method="POST"><input type="hidden" name="id" value="{{this.id}}"><button class="btn btn-warning" type="submit">Delete</button></form>'

                    $('#' + articleId).append('<div class="alert alert-info alert-dismissible" role="alert"><form action="/comments/one/' + art.comment[i]._id + '" method="POST"><input type="hidden" name="id" value="' + art.comment[i]._id + '"><button class="close" type="submit"><span aria-hidden="true">&times;</span></button><h4>' + art.comment[i].body + '<br>' + '<h4>written by ' + art.comment[i].username) + '</h4></div>';

                }
            } else {

                $('#' + articleId).html('<h4>No comments yet...</h4>');

            }

        })

        $('#modal-' + articleId).modal('show');
    });

});
