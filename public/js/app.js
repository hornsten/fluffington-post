$(document).ready(function() {


    $('.comment-button').on('click', function() {

        var currentURL = window.location.origin;
        var commentId = $(this).attr('data-button');

        console.log('hey');

    })


    $(".comment-btn").click(function(event) {

        event.preventDefault();

        var currentURL = window.location.origin;
        var commentId = $(this).attr('data-button');

        console.log(commentId);

        $.get(currentURL + "/comments/" + commentId, function(data) {
            console.log(data);

            $('#' + commentId).html('<h3>' + data.body + '<br>');
            $('#' + commentId).append('<h5>by ' + data.title);


        })

    });
});
