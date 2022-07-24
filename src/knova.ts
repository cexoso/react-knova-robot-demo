import Konva from "konva";
import robotSrc from "./asserts/robot.png";

const createRobotImage = (opts: {
  robotWidth: number;
  robotHeight: number;
}) => {
  const img = new window.Image();
  img.src = robotSrc;
  return new Konva.Image({
    image: img,
    width: opts.robotWidth,
    height: opts.robotHeight,
  });
};

interface Position {
  x: number;
  y: number;
}

const createPath = (position: Position[]) => {
  let p = "M" + position[0].x + " " + position[0].y;
  for (var i = 1; i < position.length; i = i + 1) {
    p = p + " L" + position[i].x + " " + position[i].y;
  }
  return p;
};

export const main = (width: number, height: number) => {
  const stage = new Konva.Stage({
    container: "root",
    width: width,
    height: height,
  });
  const robotWidth = 100;
  const robotHeight = 100;
  let scale = 1;
  let robotLayer: Konva.Layer | null;
  const drawRotbotRunByPath = (path: Konva.Path) => {
    if (robotLayer) {
      robotLayer.destroy();
    }
    robotLayer = new Konva.Layer();
    robotLayer.scale({ x: scale, y: scale });
    stage.add(robotLayer);
    robotLayer.add(path);
    const pathLen = path.getLength();
    const totalTime = 3000;

    let total = 0;
    const anim = new Konva.Animation(function (frame) {
      if (frame) {
        total += frame.timeDiff;
        const rate = total / totalTime;
        if (rate > 1) {
          anim.stop();
        }
        let pt = path.getPointAtLength(rate * pathLen);
        robot.position({
          x: pt.x - robotWidth / 2,
          y: pt.y - robotHeight / 2,
        });
      }
    }, robotLayer);

    const robot = createRobotImage({ robotHeight, robotWidth });
    robotLayer.add(robot);

    anim.start();
  };
  return {
    getScale() {
      return scale;
    },
    setScale(_scale: number) {
      scale = _scale;
      if (robotLayer) {
        robotLayer.scale({ x: scale, y: scale });
      }
    },
    drawRotbotRunWithPosition(positions: Position[]) {
      const konvaPath = new Konva.Path({
        x: 0,
        y: 0,
        stroke: "red",
        strokeWidth: 5,
        lineJoin: "round",
        data: createPath(positions),
      });
      drawRotbotRunByPath(konvaPath);
    },
  };
};
