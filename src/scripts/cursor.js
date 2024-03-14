var $c = $("[data-custom-cursor]");
var $h = $("a, button");
var $i = $("img");

$(window).on("mousemove", function(e) {
    var x = e.clientX;
    var y = e.clientY;
    var yOffset = -10; // Adjust this value as needed to align the cursor properly
    $c.css("transform", "matrix(1, 0, 0, 1, " + x + "," + (y - yOffset) + ")");
});

$h.on("mouseenter", function(e) {
    $c.addClass("custom-cursor-active");
});

$h.on("mouseleave", function(e) {
    $c.removeClass("custom-cursor-active");
});

$i.on("mouseenter", function(e) {
    $c.addClass("custom-cursor-active-img");
});

$i.on("mouseleave", function(e) {
    $c.removeClass("custom-cursor-active-img");
});
