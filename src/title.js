/* document.addEventListener('DOMContentLoaded', function() {
    const locoScroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true
    });
  
    gsap.registerPlugin(ScrollTrigger);
  
    const fixedTitle = document.getElementById('fixed-title');
  
    ScrollTrigger.create({
      start: 100, // Start changing the title when the scroll reaches 100 pixels
      end: "bottom bottom", // Change back when the scroll reaches the bottom of the page
      onToggle: self => {
        fixedTitle.textContent = self.isActive ? 'New Title' : 'Original Title';
      }
    });
  }); */