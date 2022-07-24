import { main } from "./knova";
import "./base.css";
const handle = main(window.innerWidth, 500);
const getData = async () => {
  const position = [
    { x: 100, y: 100 },
    { x: 300, y: 50 },
    { x: 300, y: 300 },
    { x: 400, y: 300 },
    { x: 200, y: 50 },
  ];
  return position;
};

const createZoom = () => {
  const zoomIn = document.createElement("button");
  zoomIn.innerText = "放大";
  document.body.append(zoomIn);
  zoomIn.className = "button";
  zoomIn.addEventListener("click", () => {
    handle.setScale(handle.getScale() + 0.2);
  });

  const zoomOut = document.createElement("button");
  zoomOut.innerText = "缩小";
  document.body.append(zoomOut);
  zoomOut.className = "button";
  zoomOut.addEventListener("click", () => {
    handle.setScale(handle.getScale() - 0.2);
  });

  const loadData = document.createElement("button");
  loadData.innerText = "加载数据";
  document.body.append(loadData);
  loadData.className = "button";
  loadData.addEventListener("click", () => {
    getData().then((positions) => {
      handle.drawRotbotRunWithPosition(positions);
    });
  });
};
createZoom();
