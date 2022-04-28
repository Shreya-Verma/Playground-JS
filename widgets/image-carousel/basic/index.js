let slidePosition = 0;

const slides = document.getElementsByClassName("carousel__item");
const n = slides.length;

const nextBtn = document.getElementById("carousel__button--next");
nextBtn.addEventListener("click", handleNext);

const prevBtn = document.getElementById("carousel__button--prev");
prevBtn.addEventListener("click", handlePrev);

function updateUI() {
  for (let slide of slides) {
    slide.classList.remove("carousel__item--visible");
    slide.classList.add("carousel__item--hidden");
  }
  slides[slidePosition].classList.add("carousel__item--visible");
}

function handleNext() {
  if (slidePosition === n - 1) {
    slidePosition = 0;
  } else {
    slidePosition++;
  }
  updateUI();
}

function handlePrev() {
  if (slidePosition === 0) {
    slidePosition = n - 1;
  } else {
    slidePosition--;
  }
  updateUI();
}
