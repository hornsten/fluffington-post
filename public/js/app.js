$(document).ready(function() {

    $(".comment-btn").click(function(event) {

        event.preventDefault();

        var currentURL = window.location.origin;
        var commentId = $(this).attr('data-button');

        console.log(commentId);

        $.get(currentURL + "/comments/" + commentId, function(data) {
            console.log(data);

            $('#' + commentId).html('<h3>' + data.body + '<br>' + '<h4>written by ' + data.username);


        })

        $('#modal-' + commentId).modal('show');
    });
});
