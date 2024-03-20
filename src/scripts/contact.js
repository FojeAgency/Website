$(document).ready(function() {
    // Function to auto-expand textarea
    function autoExpandTextarea(element) {
        $(element).css('height', 'auto'); // Reset height to auto
        var scrollHeight = element.scrollHeight; // Get scroll height
        $(element).css('height', scrollHeight + 'px'); // Set height to scroll height
    }

    // Auto-expand textarea on input
    $('#message').on('input', function() {
        autoExpandTextarea(this);
    });
});