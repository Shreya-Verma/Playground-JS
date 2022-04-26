const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
const btn = document.querySelector("button");
const colorSpan = document.getElementById("color");

const handleClick = () => {
  let randomColor = "#";

  for (let i = 0; i < 6; i++) {
    let index = Math.floor(Math.random() * 16);
    randomColor += colors[index];
  }
  document.body.style.backgroundColor = randomColor;
  colorSpan.textContent = randomColor;
  colorSpan.style.color = randomColor;
};

btn.addEventListener("click", handleClick);
