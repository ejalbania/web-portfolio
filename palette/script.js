var palette = [
  "#FDFFF5", // Milk white
  "#DFB78C", // Latte
  "#AB6832", // Espresso
  "#4B1F0E", // Coffee bean (medium roast)
  "#44624A", // Matcha
];

document.addEventListener("DOMContentLoaded", function () {
  let body = document.body;

  let tags = palette.map((color) => {
    let tag = document.createElement("div");
    tag.style.backgroundColor = color;
    tag.classList.add("colors");
    return tag;
  });

  body.append(...tags);
});
