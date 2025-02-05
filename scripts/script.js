document.addEventListener("DOMContentLoaded", (event) => {
  configureHeader();
});

function configureHeader() {
  let logo = document.querySelector("#heading .contents img");
  let header = document.querySelector("#heading");
  let cursor = header.querySelector(".cursor");
  let kettleIcon = cursor.querySelector("img");
  let areaIndicator = document.querySelector("div.cursor-guide-bar");
  let dripComponent = document.querySelector("#drip-component");

  let kettleIsTilted = false;
  let isTimeoutRunning = false;
  let guideBarShouldShow = false;

  let headerRect = header.getBoundingClientRect();
  let headerWidth = headerRect.width;
  let headerHeight = headerRect.height;
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
    kettleIcon.ondragstart = (e) => {
      return false;
    };
    header.onmousedown = undefined;
    header.onmouseup = undefined;

    headerWidth = headerRect.width;
    headerHeight = headerRect.height;
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

    areaIndicator.style.width = `${filterOpening}px`;
    areaIndicator.style.height = `${kettleYSpace - 20}px`;

    let spoutTipY = 0;

    const moveKettle = (e) => {
      if (!kettleIsTilted) {
        let isSpoutOnRight = kettleShouldFlip(e);
        let radius = isSpoutOnRight ? 9 - kettleWidth : kettleWidth - 9;
        let tiltAngle = isSpoutOnRight ? -45 : 45;
        spoutTipY =
          e.clientY - kettleHeight / 3.2 + radius * Math.sin(tiltAngle);

        cursor.style.transform = `${updateKettleLoc(e)} ${updateKettleFlip(e)}`;

        let cursorXMarker = filterXLoc + radius;
        let kettleIsAboveFilter = e.clientY < kettleYSpace - 20;
        let kettleAlignsWithFilter =
          e.clientX > cursorXMarker &&
          e.clientX < cursorXMarker + filterOpening;

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
      }
    };

    const tiltKettle = (e) => {
      let tiltDegree = e.type == "mouseup" ? 0 : -45;
      kettleIsTilted = e.type == "mousedown";

      if (kettleIsTilted) {
        dripComponent.style.transition = "1s 0.2s ease-in";
        dripComponent.style.width = `${logoYOrigin - spoutTipY}px`;
        dripComponent.style.height = `${logoYOrigin - spoutTipY}px`;
      } else {
        dripComponent.style.transition = "0.16s 0s";
        dripComponent.style.width = `0px`;
        dripComponent.style.height = `0px`;
      }

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
