$(document).ready(function() {

    $(".comment-btn").click(function(event) {

        event.preventDefault();

        var currentURL = window.location.origin;
        var articleId = $(this).attr('data-button');

        $.get(currentURL + "/populated/" + articleId, function(data) {

            var art = data[0];

            if (art.comment.length) {

                for (var i = 0; i < data[0].comment.length; i++) {

                    $('#' + articleId).append('<h3>' + art.comment[i].body + '<br>' + '<h4>written by ' + art.comment[i].username);

                }
            } else {
                $('#' + articleId).html('<h3>No comments yet...</h3>');

            }



        })

        $('#modal-' + articleId).modal('show');
    });



});
