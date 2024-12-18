Shery.mouseFollower({
    //Parameters are optional.
    skew: true,
    // ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });
  
  Shery.makeMagnet(".magnet" /* Element to target.*/, {
    //Parameters are optional.
    // ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    // duration: 1,
  });
  
  const scroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    swiperAnimation();
    page4Animation();
    menuAnimation();
    loaderAnimation();
  });
  
  function page4Animation() {
    var elemC = document.querySelector("#elem-container");
    var fixed = document.querySelector("#fixed-image");
  
    if (elemC) {
      elemC.addEventListener("mouseenter", function () {
        fixed.style.display = "block";
      });
  
      elemC.addEventListener("mouseleave", function () {
        fixed.style.display = "none";
      });
    }
  
    var elems = document.querySelectorAll(".elem");
    elems.forEach(function (e) {
      e.addEventListener("mouseenter", function () {
        var image = e.getAttribute("data-image");
        fixed.style.backgroundImage = `url(${image})`;
      });
    });
  }
  
  function swiperAnimation() {
    var swiper = new Swiper(".mySwiper", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 100,
    });
  }
  function menuAnimation() {
    var menu = document.querySelector("nav h3");
    var full = document.querySelector("#full-scr");
    var navimg = document.querySelector("nav img");
    var flag = 0;
    menu.addEventListener("click", function () {
      if (flag == 0) {
        full.style.top = 0;
        navimg.style.opacity = 0;
        flag = 1;
      } else {
        full.style.top = "-100%";
        navimg.style.opacity = 1;
        flag = 0;
      }
    });
  }
  
  function loaderAnimation() {
    var loader = document.querySelector("#loader");
    setTimeout(function () {
      loader.style.top = "-100%";
    }, 4200);
  }
  
  var typed1 = new Typed(".typing-text", {
    strings: ["SHRUJAN 2.0"],
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
    onComplete: function (self) {
      setTimeout(function () {
        typed2.reset();
        typed2.start();
      }, 3000);
    },
  });
  
  var typed2 = new Typed(".typing-text-1", {
    strings: ["IS HERE"],
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
    onComplete: function (self) {
      setTimeout(function () {
        typed1.reset();
        typed1.start();
      }, 3000);
    },
  });
  
  // Start the initial typing
  typed1.start();
  
  
  swiperAnimation();
  page4Animation();
  menuAnimation();
  loaderAnimation();