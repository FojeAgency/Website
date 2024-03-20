// Define ScrollTrigger for each .text element
gsap.utils.toArray('.text').forEach((trigger, index) => {
    ScrollTrigger.create({
        trigger: trigger,
        start: "center center", // Set start to the middle of each element
        end: "bottom 50% bottom 50%",
        scroller: "#scroll-content",
        onToggle: (self) => {
            const isVisible = self.isActive;
            if (isVisible) {
                showText(index);
            } else {
                hideText(index);
            }
        },
        markers: true
    });
});



// Function to show text based on index
function showText(index) {
    const text = document.getElementById(`text${index + 1}`);
    text.classList.add("visible");
}

// Function to hide text based on index
function hideText(index) {
    const text = document.getElementById(`text${index + 1}`);
    text.classList.remove("visible");
}
