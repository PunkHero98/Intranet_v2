$("div.backButton").on("click", function () {
  window.history.back();
});

let slideIndex1 = 1;
showSlides1(slideIndex1);

// Next/previous controls
function plusSlides1(n) {
  showSlides1((slideIndex1 += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides1((slideIndex1 = n));
}

function showSlides1(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex1 = 1;
  }
  if (n < 1) {
    slideIndex1 = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace("activePic", "");
  }
  slides[slideIndex1 - 1].style.display = "block";
  dots[slideIndex1 - 1].className += " activePic";
}
