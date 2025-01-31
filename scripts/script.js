document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  configureKettle();
});

function configureKettle() {
  console.log("Configuring kettle");
  let kettleIsTilted = false;

  let logo = document.querySelector("#heading .contents img");
  let header = document.querySelector("#heading");
  let cursor = header.querySelector(".cursor");
  let kettleIcon = header.querySelector("img");

  let headerWidth = header.getBoundingClientRect().width;
  let logoRect = logo.getBoundingClientRect();
  let logoXOrigin = logoRect.x;
  let logoYOrigin = logoRect.y;
  let filterWidth = logoRect.width / 2;
  let filterOffset = filterWidth / 2;
  let kettleHeight = kettleIcon.getBoundingClientRect().height;

  cursor.style.transition = "0.3s";

  const moveKettle = (e) => {
    if (!kettleIsTilted) {
      let kettleSpace = kettleHeight / 1.5;
      let kettleIsAboveFilter = e.clientY < logoYOrigin - kettleSpace;
      let kettleIsInlineWithFilter = headerWidth / 2 - filterWidth;

      header.onmousedown = kettleIsAboveFilter ? tiltKettle : undefined;
      header.onmouseup = kettleIsAboveFilter ? tiltKettle : undefined;

      cursor.style.transform = `
        ${updateKettleLocation(e)}
        ${updateKettleFlip(e)}
        `;

      console.log(`kettleIsInlineWithFilter: ${kettleIsInlineWithFilter}`);
    }
  };

  const tiltKettle = (e) => {
    let tiltDegree = e.type == "mouseup" ? 0 : -45;
    kettleIsTilted = e.type == "mousedown";

    cursor.style.transform = `
        ${updateKettleLocation(e)}
        ${updateKettleFlip(e)} 
        rotate(${tiltDegree}deg)
    `;
  };

  header.onmousemove = moveKettle;

  function updateKettleFlip(event) {
    return `rotateY(${event.clientX < headerWidth / 2 ? 180 : 0}deg)`;
  }

  function updateKettleLocation(event) {
    return `translate(calc(${event.clientX}px - 50%), calc(${event.clientY}px - 50%))`;
  }
}
