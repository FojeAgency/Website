gsap.registerPlugin(ScrollTrigger);

const pageContainer = document.querySelector(".container");

const scroller = new LocomotiveScroll({
  el: pageContainer,
  smooth: true
});

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
  let pinWrapWidth = pinWrap.offsetWidth;
  let horizontalScrollLength = pinWrapWidth - window.innerWidth;

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