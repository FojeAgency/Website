gsap.registerPlugin(ScrollTrigger);

const pageContainer = document.querySelector(".container");
console.log("pageContainer:", pageContainer);

const scroller = new LocomotiveScroll({
  el: pageContainer,
  smooth: true
});
console.log("scroller:", scroller);

scroller.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(pageContainer, {
  scrollTop(value) {
    return arguments.length
      ? scroller.scrollTo(value, 0, 0)
      : scroller.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  pinType: pageContainer.style.transform ? "transform" : "fixed"
});

window.addEventListener("load", function () {
  let pinWrap = document.querySelector(".pin-wrap");
  console.log("pinWrap:", pinWrap);
  
  let pinWrapWidth = pinWrap.offsetWidth;
  console.log("pinWrapWidth:", pinWrapWidth);
  
  let horizontalScrollLength = pinWrapWidth - window.innerWidth;
  console.log("horizontalScrollLength:", horizontalScrollLength);
  
  gsap.to(pinWrap, {
    scrollTrigger: {
      scroller: pageContainer,
      scrub: true,
      trigger: "#sectionPin",
      pin: true,
      start: "top top",
      end: `+=${horizontalScrollLength}` // Animate to the end of the horizontal scroll
    },
    x: -horizontalScrollLength,
    ease: "none"
  });

  ScrollTrigger.addEventListener("refresh", () => scroller.update()); // Update Locomotive Scroll
  ScrollTrigger.refresh();
});

document.querySelector('.container').addEventListener('scroll', function () {
  const scrollPosition = this.scrollTop;
  console.log("scrollPosition:", scrollPosition);
  
  const opacity = 1 - (scrollPosition / this.scrollHeight);
  console.log("opacity:", opacity);
  
  document.getElementById('background-image').style.opacity = opacity.toString();
});

// Get the banner section element
const bannerSection = document.querySelector("#banner");
console.log("Banner section:", bannerSection);

// Calculate the end position of the banner section
const bannerEndPosition = bannerSection.offsetTop + bannerSection.offsetHeight;
console.log("Banner end position:", bannerEndPosition);

// Function to fade out the background image when scrolling past the end of the banner section
const fadeOutBackground = () => {
  const scrollPosition = scroller.scroll.instance.scroll.y; // Get the current scroll position
  if (scrollPosition >= bannerEndPosition) {
    gsap.to('#background-image', {
      opacity: 0,
      duration: 0.2 // Adjust the duration as needed
    });
  } else {
    gsap.to('#background-image', {
      opacity: 1,
      duration: 0.2 // Adjust the duration as needed
    });
  }
};

// Call the fadeOutBackground function on scroll
scroller.on('scroll', fadeOutBackground);



