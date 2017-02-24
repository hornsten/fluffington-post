$(document).ready(function() {

    $(".comment-btn").click(function(event) {

        event.preventDefault();

        var currentURL = window.location.origin;
        var articleId = $(this).attr('data-button');

        $.get(currentURL + "/populated/" + articleId, function(data) {

            var art = data[0];

            if (art.comment.length) {

                for (var i = 0; i < data[0].comment.length; i++) {

                    // '<form action="/articles/one/{{this._id}}" method="POST"><input type="hidden" name="id" value="{{this.id}}"><button class="btn btn-warning" type="submit">Delete</button></form>'

                    $('#' + articleId).append('<div class="alert alert-info alert-dismissible" role="alert"><form action="/comments/one/' + art.comment[i]._id + '" method="POST"><input type="hidden" name="id" value="' + art.comment[i]._id + '"><button class="btn btn-warning" type="submit">Delete</button><h3>' + art.comment[i].body + '<br>' + '<h4>written by ' + art.comment[i].username) + '</h3></div>';

                }
            } else {

                $('#' + articleId).html('<h3>No comments yet...</h3>');

            }



        })

        $('#modal-' + articleId).modal('show');
    });



});
