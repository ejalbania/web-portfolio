document.addEventListener("DOMContentLoaded", (event) => {
  configureHeader();
});

function configureHeader() {
  let logo = document.querySelector("#heading .contents img");
  let header = document.querySelector("#heading");
  let cursor = header.querySelector(".cursor");
  let kettleIcon = header.querySelector("img");
  let areaIndicator = document.querySelector("div.cursor-guide-bar");

  let kettleIsTilted = false;
  let isTimeoutRunning = false;
  let guideBarShouldShow = false;

  let headerWidth = header.getBoundingClientRect().width;
  let kettleBounds = kettleIcon.getBoundingClientRect();
  let logoRect = logo.getBoundingClientRect();
  let logoXOrigin = logoRect.x;
  let logoYOrigin = logoRect.y;
  let filterWidth = logoRect.width / 2;
  let filterOffset = filterWidth / 2;
  let filterXLoc = logoXOrigin + filterOffset;
  let filterOpening = filterWidth - 8;
  let kettleHeight = kettleBounds.height;
  let kettleWidth = kettleBounds.width;
  let kettleYSpace = logoYOrigin - kettleHeight / 2.5;

  function configureKettle() {
    header.onmousedown = undefined;
    header.onmouseup = undefined;

    headerWidth = header.getBoundingClientRect().width;
    kettleBounds = kettleIcon.getBoundingClientRect();
    logoRect = logo.getBoundingClientRect();
    logoXOrigin = logoRect.x;
    logoYOrigin = logoRect.y;
    filterWidth = logoRect.width / 2;
    filterOffset = filterWidth / 2;
    filterXLoc = logoXOrigin + filterOffset;
    filterOpening = filterWidth - 8;
    kettleHeight = kettleBounds.height;
    kettleWidth = kettleBounds.width;
    kettleYSpace = logoYOrigin - kettleHeight / 2.5;

    areaIndicator.style.width = `${filterWidth - 8}px`;
    areaIndicator.style.height = `${kettleYSpace}px`;

    cursor.style.transition = "0.3s";

    const moveKettle = (e) => {
      cursor.style.transform = `${updateKettleLoc(e)} ${updateKettleFlip(e)}`;

      let cursorXMarker =
        filterXLoc +
        (kettleShouldFlip(e) ? 16 - kettleWidth : kettleWidth - 16);
      let kettleIsAboveFilter = e.clientY < kettleYSpace;
      let kettleAlignsWithFilter =
        e.clientX > cursorXMarker && e.clientX < cursorXMarker + filterOpening;

      let kettleShouldTilt = kettleIsAboveFilter && kettleAlignsWithFilter;

      header.onmousedown = kettleShouldTilt ? tiltKettle : undefined;
      header.onmouseup = kettleShouldTilt ? tiltKettle : undefined;

      if (!isTimeoutRunning && !guideBarShouldShow) {
        isTimeoutRunning = true;
        setTimeout(() => {
          console.log("Timeout finished");
          guideBarShouldShow = true;
          areaIndicator.style.animation =
            "fade-in 0.75s ease-in-out 1s infinite";
          areaIndicator.style.left = `${cursorXMarker}px`;
        }, 5000);
      } else if (guideBarShouldShow) {
        areaIndicator.style.left = `${cursorXMarker}px`;
      }
    };

    const tiltKettle = (e) => {
      let tiltDegree = e.type == "mouseup" ? 0 : -45;
      kettleIsTilted = e.type == "mousedown";

      cursor.style.transform = `
          ${updateKettleLoc(e)}
          ${updateKettleFlip(e)} 
          rotate(${tiltDegree}deg)
      `;
    };

    header.onmousemove = moveKettle;

    function kettleShouldFlip(event) {
      return event.clientX < headerWidth / 2;
    }

    function updateKettleFlip(event) {
      return `rotateY(${kettleShouldFlip(event) / 2 ? 180 : 0}deg)`;
    }

    function updateKettleLoc(event) {
      return `translate(calc(${event.clientX}px - 50%), calc(${event.clientY}px - 50%))`;
    }
  }

  window.onresize = (event) => {
    configureKettle();
    moveKettle();
  };

  configureKettle();
}
