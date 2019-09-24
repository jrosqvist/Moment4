// Ändrar utseendet på mobil-menyknappen
$(document).ready(function(){
    $("#mobile-menu").on('click', function(){
        $(this).toggleClass("open");
    });
});

// Öppnar och stänger mobil-menyn
$(document).ready(function(){
    $("#mobile-menu").on('click', function(){
        $("#main-nav ul").toggleClass("open");
    });
});
