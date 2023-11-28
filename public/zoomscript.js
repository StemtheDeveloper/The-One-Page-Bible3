// const pinchZoom = new PinchZoom("#contents");
// pinchZoom.disableMultiTouch = true;
// pinchZoom.zoomTo(2);

// Disable pinch zoom on iOS devices
if (
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/iPhone/i)
) {
  document.addEventListener("touchmove", function (event) {
    event.preventDefault();
  });
}

const addStuffToContents = () => {
  // Check if the alert has been shown before
  if (!localStorage.getItem("alertShown")) {
    // If not shown, display the alert box
    alert(
      "Welcome to The One Page Bible! click and drag to pan, and scroll in/out to Zoom"
    );

    // Set a flag in localStorage to indicate that the alert has been shown
    localStorage.setItem("alertShown", "true");
  }
};

const grid = document.querySelector(".grid");
const contents = document.querySelector(".contents");
const gridSize = grid.getBoundingClientRect();

let panningAllowed = false;
let zoomFactor = 1;

const translate = { scale: zoomFactor, translateX: 0, translateY: 0 };
const initialContentsPos = { x: 0, y: 0 };
const initialZoomPos = { x: 0, y: 0 };
const pinnedMousePosition = { x: 0, y: 0 };
const mousePosition = { x: 0, y: 0 };

const mousedown = (event) => {
  initialContentsPos.x = translate.translateX;
  initialContentsPos.y = translate.translateY;
  pinnedMousePosition.x = event.clientX;
  pinnedMousePosition.y = event.clientY;
  panningAllowed = true;
};

const mousemove = (event) => {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
  if (panningAllowed) {
    const diffX = mousePosition.x - pinnedMousePosition.x;
    const diffY = mousePosition.y - pinnedMousePosition.y;
    translate.translateX = initialContentsPos.x + diffX;
    translate.translateY = initialContentsPos.y + diffY;
  }
  update();
};

const mouseup = () => {
  panningAllowed = false;
};

const zoom = (event) => {
  if (
    zoomFactor + event.deltaY / 6000 > 6 ||
    zoomFactor + event.deltaY / 6000 < 0.01
  ) {
    return;
  }
  const oldZoomFactor = zoomFactor;
  zoomFactor += event.deltaY / 6000;
  mousePosition.x = event.clientX - gridSize.x;
  mousePosition.y = event.clientY - gridSize.y;
  translate.scale = zoomFactor;
  const contentMousePosX = mousePosition.x - translate.translateX;
  const contentMousePosY = mousePosition.y - translate.translateY;
  const x = mousePosition.x - contentMousePosX * (zoomFactor / oldZoomFactor);
  const y = mousePosition.y - contentMousePosY * (zoomFactor / oldZoomFactor);
  translate.translateX = x;
  translate.translateY = y;
  update();
};

const update = () => {
  const matrix = `matrix(${translate.scale}, 0, 0, ${translate.scale}, ${translate.translateX}, ${translate.translateY})`;
  contents.style.transform = matrix;
};

addStuffToContents();
grid.addEventListener("wheel", zoom);
grid.addEventListener("mousedown", mousedown);
grid.addEventListener("mousemove", mousemove);
grid.addEventListener("mouseup", mouseup);
