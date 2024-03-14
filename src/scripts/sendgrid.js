/* document.addEventListener('DOMContentLoaded', function () {
    var contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission behavior
        
        // Capture form data
        var formData = new FormData(contactForm);
        
        // Send form data via AJAX
        fetch('/sendmail', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('Email sent successfully');
                window.location.href = '/index.html';
            } else {
                throw new Error('Error sending email');
            }
        })
        .catch(error => {
            console.error('Error sending email:', error);
            alert('Error sending email');
        });
    });
}); */