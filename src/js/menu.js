$(document).ready(function(){
    $("#mobile-menu").on('click', function(){
        $(this).toggleClass("open");
    });
});

$(document).ready(function(){
    $("#mobile-menu").on('click', function(){
        $("#main-nav ul").toggleClass("open");
    });
});
